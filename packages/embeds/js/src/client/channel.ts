import { fetchEventSource } from "@fortaine/fetch-event-source"
import { sendRequest } from "@openbot/lib"
import { nanoid } from 'nanoid';
import { ChannelState } from './channelState';
import { Client } from './client';
import type {
	Channel as IChannel,
	ChannelConfigWithInfo,
	APIResponse,
	ChannelData,
	ChannelMemberAPIResponse,
	ChannelQueryOptions,
	ChannelResponse,
	EventAPIResponse,
	EventHandler,
	GetRepliesAPIResponse,
	MarkReadOptions,
	MarkUnreadOptions,
	MemberSort,
	Message,
	MessagePaginationOptions,
	MessageSetType,
	QueryMembersOptions,
	Reaction,
	ReactionAPIResponse,
	SendMessageAPIResponse,
	UserFilters,
	UserResponse,
	QueryChannelAPIResponse,
	SendFileAPIResponse,
	ChannelAPIResponse,
	ChannelMemberResponse,
	Event,
	FormatMessageResponse,
	MessageResponse,
} from '@openbot/aibot-uikit/dist/types';
import { MessageStream } from "./messageStream";
import { DefaultChatGenerics } from './client';

/**
 * Channel - The Channel class manages it's own state.
 */
export class Channel<OneChatGenerics extends DefaultChatGenerics = DefaultChatGenerics> implements IChannel<OneChatGenerics> {
	_client: Client<OneChatGenerics>;
	type: string;
	id: string | undefined;
	data: ChannelData<OneChatGenerics> | ChannelResponse<OneChatGenerics> | undefined;
	_data: ChannelData<OneChatGenerics> | ChannelResponse<OneChatGenerics>;
	cid: string;
	/**  */
	listeners: { [key: string]: (string | EventHandler<OneChatGenerics>)[] };
	state: ChannelState<OneChatGenerics>;
	/**
	 * This boolean is a vague indication of weather the channel exists on chat backend.
	 *
	 * If the value is true, then that means the channel has been initialized by either calling
	 * channel.create() or channel.query() or channel.watch().
	 *
	 * If the value is false, then channel may or may not exist on the backend. The only way to ensure
	 * is by calling channel.create() or channel.query() or channel.watch().
	 */
	initialized: boolean;
	/**
	 * Indicates weather channel has been initialized by manually populating the state with some messages, members etc.
	 * Static state indicates that channel exists on backend, but is not being watched yet.
	 */
	offlineMode: boolean;
	lastKeyStroke?: Date;
	lastTypingEvent: Date | null;
	isTyping: boolean;
	disconnected: boolean;

	/**
	 * constructor - Create a channel
	 *
	 * @param {Client<OneChatGenerics>} client the chat client
	 * @param {string} type  the type of channel
	 * @param {string} [id]  the id of the chat
	 * @param {ChannelData<OneChatGenerics>} data any additional custom params
	 *
	 * @return {Channel<OneChatGenerics>} Returns a new uninitialized channel
	 */
	constructor(
		client: Client<OneChatGenerics>,
		type: string,
		id: string | undefined,
		data: ChannelData<OneChatGenerics> & { agent: any },
	) {
		const validTypeRe = /^[\w_-]+$/;
		const validIDRe = /^[\w!_-]+$/;

		if (!validTypeRe.test(type)) {
			throw new Error(`Invalid chat type ${type}, letters, numbers and "_-" are allowed`);
		}
		if (typeof id === 'string' && !validIDRe.test(id)) {
			throw new Error(`Invalid chat id ${id}, letters, numbers and "!-_" are allowed`);
		}

		this._client = client;
		this.type = type;
		this.id = id;
		// used by the frontend, gets updated:
		this.data = data;
		// this._data is used for the requests...
		this._data = { ...data };
		this.cid = `${type}:${id}`;
		this.listeners = {};
		// perhaps the state variable should be private
		this.state = new ChannelState<OneChatGenerics>(this);
		this.initialized = false;
		this.offlineMode = false;
		this.lastTypingEvent = null;
		this.isTyping = false;
		this.disconnected = false;
	}

	/**
	 * getClient - Get the chat client for this channel. If client.disconnect() was called, this function will error
	 *
	 * @return {Client<OneChatGenerics>}
	 */
	getClient(): Client<OneChatGenerics> {
		if (this.disconnected === true) {
			throw Error(`You can't use a channel after client.disconnect() was called`);
		}
		return this._client;
	}

	/**
	 * getConfig - Get the config for this channel id (cid)
	 *
	 * @return {Record<string, unknown>}
	 */
	getConfig(): ChannelConfigWithInfo<OneChatGenerics> {
		return {
			reminders: true,
			uploads: true, // 允许上传文件
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		}
	}

	/**
	 * sendMessage - Send a message to this channel
	 *
	 * @param {Message<OneChatGenerics>} message The Message object
	 * @param {boolean} [options.skip_enrich_url] Do not try to enrich the URLs within message
	 * @param {boolean} [options.skip_push] Skip sending push notifications
	 * @param {boolean} [options.is_pending_message] Make this message pending
	 * @param {Record<string,string>} [options.pending_message_metadata] Metadata for the pending message
	 * @param {boolean} [options.force_moderation] Apply force moderation for server-side requests
	 *
	 * @return {Promise<SendMessageAPIResponse<OneChatGenerics>>} The Server Response
	 */
	async sendMessage(
		message: Message<OneChatGenerics>,
		_options?: {
			force_moderation?: boolean;
			is_pending_message?: boolean;
			keep_channel_hidden?: boolean;
			pending_message_metadata?: Record<string, string>;
			skip_enrich_url?: boolean;
			skip_push?: boolean;
		},
	): Promise<SendMessageAPIResponse<OneChatGenerics>> {

		const { agent } = this._data ?? {}
		let messageSent: ReturnType<ChannelState<OneChatGenerics>['formatMessage']> | undefined // 发送的消息
		let responseText = "" // 回复的文本
		const stream = new MessageStream(this) // 回复的消息流

		// 发送的图片
		const images = message.attachments?.map(attachment => {
			if (attachment.type !== 'image') return undefined
			return { url: attachment.image_url }
		}).filter(image => !!image)

		// 发送的语音 
		const voiceAttachment = message.attachments?.find(attachment => attachment.type === 'audio')
		const voice = voiceAttachment ? { url: voiceAttachment.asset_url } : undefined

		await fetchEventSource(`${this.getClient().baseURL}/chat/send_message`, {
			method: "POST",
			body: JSON.stringify({
				text: message.text,
				streaming: true,
				conversation_id: this.id,
				images,
				voice,
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			onmessage: (msg) => {
				const text = msg.data
				if (!text) return
				try {
					const json = JSON.parse(text)
          if (json.event) {
            this.getClient().dispatchEvent({
              cid: this.cid,
              type: json.event,
              data: json.data,
            })

            return
          }

          const delta = json.delta
					if (!delta) return

					// 追加响应的文本
					responseText += delta;

					if (!stream.opened) {
						// 得到第一个响应后，添加对应的回复消息
						const messageId = nanoid()
						this.state.addMessageSorted({
							id: messageId,
							type: 'regular',
							text: responseText,
							status: 'received',
							user: {
								id: agent.id,
								name: agent.name,
								image: agent.avatar?.thumbnail
							},
						})
						// 第一次响应，打开消息流
						stream.open(messageId)

					} else {
						// 响应文本追加后，更新对应的消息
						this.state.updateMessage({ id: stream.messageId }, (msg) => {
							return { ...msg, text: responseText }
						})
						// 这里要激发事件，让 uikit 同步上面修改后的消息
						this.getClient().dispatchEvent({
							cid: this.cid,
							type: 'message.updated'
						})
					}

					// 消息流追加文本
					stream.append(delta)

				} catch (e) {
					console.error(e);
				}
			},
			onerror: (e) => {
				console.error(e)
				stream.close()
				// rethrow to stop the operation. do nothing to automatically retry.
				throw e
			},
			onclose: () => {
				stream.close()

				// 标记发送消息成功
				this.state.updateMessage({ id: message.id }, (msg) => {
					messageSent = { ...msg, status: 'received', updated_at: new Date() }
					return messageSent
				})
				// 这里要激发事件，让 uikit 同步上面修改后的消息
				this.getClient().dispatchEvent({
					cid: this.cid,
					type: 'message.updated'
				})
			},
			openWhenHidden: true,
		});

		return {
			duration: "",
			// 返回发送的消息
			message: {
				...messageSent,
				created_at: messageSent?.created_at.toISOString(),
				updated_at: messageSent?.updated_at.toISOString(),
			} as MessageResponse<OneChatGenerics>,
		}
	}

	async sendFile(
		uri: string | File,
		name?: string,
		contentType?: string,
		_user?: UserResponse<OneChatGenerics>,
	): Promise<SendFileAPIResponse> {
		if (typeof uri === 'string') throw new Error('invalid file')
		const file = uri

		const filename = name ?? file.name
		let ext = filename.split('.').pop()
		ext = ext ? `.${ext}` : ''

		// 生成上传链接
		const generateUploadLinkResp = await sendRequest<{ url: string }>({
			url: `${this.getClient().baseURL}/files/generate-upload-link`,
			method: 'POST',
			body: {
				type: contentType ?? file.type,
				filename: `${nanoid()}${ext}`
			}
		})
		if (generateUploadLinkResp.error) {
			throw generateUploadLinkResp.error
		}
		if (!generateUploadLinkResp.data) {
			throw new Error('generate upload link error')
		}
		const { url: uploadUrl } = generateUploadLinkResp.data

		// 上传文件
		const body = await file.arrayBuffer()
		await fetch(uploadUrl, {
			method: 'PUT',
			body
		})
		const url = uploadUrl.split('?')[0]
		return {
			duration: '',
			file: url
		}
	}

	async sendImage(
		uri: string | File,
		name?: string,
		contentType?: string,
		user?: UserResponse<OneChatGenerics>,
	): Promise<SendFileAPIResponse> {
		return this.sendFile(uri, name, contentType, user)
	}

	async deleteFile(_url: string): Promise<APIResponse> {
		throw new Error('unimplemented channel method `deleteFile`')
	}

	async deleteImage(_url: string): Promise<APIResponse> {
		throw new Error('unimplemented channel method `deleteImage`')
	}

	async sendAction(_messageID: string, _formData: Record<string, string>): Promise<SendMessageAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented channel method `sendAction`')
	}

	/**
	 * queryMembers - Query Members
	 *
	 * @param {UserFilters<OneChatGenerics>}  filterConditions object MongoDB style filters
	 * @param {MemberSort<OneChatGenerics>} [sort] Sort options, for instance [{created_at: -1}].
	 * When using multiple fields, make sure you use array of objects to guarantee field order, for instance [{name: -1}, {created_at: 1}]
	 * @param {{ limit?: number; offset?: number }} [options] Option object, {limit: 10, offset:10}
	 *
	 * @return {Promise<ChannelMemberAPIResponse<OneChatGenerics>>} Query Members response
	 */
	async queryMembers(
		_filterConditions: UserFilters<OneChatGenerics>,
		_sort?: MemberSort<OneChatGenerics>,
		_options?: QueryMembersOptions,
	): Promise<ChannelMemberAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented channel method `queryMembers`')
	}

	/**
	 * sendReaction - Send a reaction about a message
	 *
	 * @param {string} messageID the message id
	 * @param {Reaction<OneChatGenerics>} reaction the reaction object for instance {type: 'love'}
	 * @param {{ enforce_unique?: boolean, skip_push?: boolean }} [options] Option object, {enforce_unique: true, skip_push: true} to override any existing reaction or skip sending push notifications
	 *
	 * @return {Promise<ReactionAPIResponse<OneChatGenerics>>} The Server Response
	 */
	async sendReaction(
		_messageID: string,
		_reaction: Reaction<OneChatGenerics>,
		_options?: { enforce_unique?: boolean; skip_push?: boolean },
	): Promise<ReactionAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented channel method `sendReaction`')
	}

	/**
	 * deleteReaction - Delete a reaction by user and type
	 *
	 * @param {string} messageID the id of the message from which te remove the reaction
	 * @param {string} reactionType the type of reaction that should be removed
	 * @param {string} [user_id] the id of the user (used only for server side request) default null
	 *
	 * @return {Promise<ReactionAPIResponse<OneChatGenerics>>} The Server Response
	 */
	async deleteReaction(_messageID: string, _reactionType: string, _user_id?: string): Promise<ReactionAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented channel method `deleteReaction`')
	}

	/**
	 * muteStatus - returns the mute status for the current channel
	 * @return {{ muted: boolean; createdAt: Date | null; expiresAt: Date | null }} { muted: true | false, createdAt: Date | null, expiresAt: Date | null}
	 */
	muteStatus(): {
		createdAt: Date | null;
		expiresAt: Date | null;
		muted: boolean;
	} {
		return {
			createdAt: null,
			expiresAt: null,
			muted: false
		}
	}

	/**
	 * keystroke - First of the typing.start and typing.stop events based on the users keystrokes.
	 * Call this on every keystroke
	 * @see {@link https://getstream.io/chat/docs/typing_indicators/?language=js|Docs}
	 * @param {string} [parent_id] set this field to `message.id` to indicate that typing event is happening in a thread
	 */
	async keystroke(_parent_id?: string): Promise<void> {
		if (!this.getConfig()?.typing_events) {
			return;
		}
		const now = new Date();
		const diff = this.lastTypingEvent && now.getTime() - this.lastTypingEvent.getTime();
		this.lastKeyStroke = now;
		this.isTyping = true;
		// send a typing.start every 2 seconds
		if (diff === null || diff > 2000) {
			this.lastTypingEvent = new Date();
			// await this.sendEvent({
			//   type: 'typing.start',
			//   parent_id,
			// } as Event<OneChatGenerics>);
		}
	}

	/**
	 * stopTyping - Sets last typing to null and sends the typing.stop event
	 * @see {@link https://getstream.io/chat/docs/typing_indicators/?language=js|Docs}
	 * @param {string} [parent_id] set this field to `message.id` to indicate that typing event is happening in a thread
	 */
	async stopTyping(_parent_id?: string): Promise<void> {
		throw new Error('unimplemented channel method `stopTyping`')
	}

	/**
	 * markRead - Send the mark read event for this user, only works if the `read_events` setting is enabled
	 *
	 * @param {MarkReadOptions<OneChatGenerics>} data
	 * @return {Promise<EventAPIResponse<OneChatGenerics> | null>} Description
	 */
	async markRead(_data: MarkReadOptions<OneChatGenerics> = {}): Promise<EventAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented channel method `markRead`')
	}

	/**
	 * markUnread - Mark the channel as unread from messageID, only works if the `read_events` setting is enabled
	 *
	 * @param {MarkUnreadOptions<OneChatGenerics>} data
	 * @return {APIResponse} An API response
	 */
	async markUnread(_data: MarkUnreadOptions<OneChatGenerics>): Promise<APIResponse> {
		throw new Error('unimplemented channel method `markUnread`')
	}

	/**
	 * watch - Loads the initial channel state and watches for changes
	 *
	 * @param {ChannelQueryOptions<OneChatGenerics>} options additional options for the query endpoint
	 *
	 * @return {Promise<QueryChannelAPIResponse<OneChatGenerics>>} The server response
	 */
	async watch(options?: ChannelQueryOptions<OneChatGenerics>): Promise<QueryChannelAPIResponse<OneChatGenerics>> {
		const defaultOptions = {
			state: true,
			watch: true,
			presence: false,
		};

		// Make sure we wait for the connect promise if there is a pending one
		// await this.getClient().wsPromise;

		// if (!this.getClient()._hasConnectionID()) {
		//   defaultOptions.watch = false;
		// }

		const combined = { ...defaultOptions, ...options };
		const state = await this.query(combined, 'latest');

		this.initialized = true;
		this.data = state.channel;

		return state;
	}

	/**
	 * getReplies - List the message replies for a parent message
	 *
	 * @param {string} parent_id The message parent id, ie the top of the thread
	 * @param {MessagePaginationOptions & { user?: UserResponse<OneChatGenerics>; user_id?: string }} options Pagination params, ie {limit:10, id_lte: 10}
	 *
	 * @return {Promise<GetRepliesAPIResponse<OneChatGenerics>>} A response with a list of messages
	 */
	async getReplies(
		_parent_id: string,
		_options: MessagePaginationOptions & { user?: UserResponse<OneChatGenerics>; user_id?: string },
	): Promise<GetRepliesAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented channel method `getReplies`')
	}

	/**
	 * lastRead - returns the last time the user marked the channel as read if the user never marked the channel as read, this will return null
	 * @return {Date | null | undefined}
	 */
	lastRead(): Date | null | undefined {
		this._checkInitialized();
		const { userID } = this.getClient();
		if (userID) {
			return this.state.read[userID] ? this.state.read[userID].last_read : null;
		}
		return
	}

	/**
	 * countUnread - Count of unread messages
	 *
	 * @param {Date | null} [lastRead] lastRead the time that the user read a message, defaults to current user's read state
	 *
	 * @return {number} Unread count
	 */
	countUnread(lastRead?: Date | null): number {
		if (!lastRead) return this.state.unreadCount;

		let count = 0;
		for (let i = 0; i < this.state.latestMessages.length; i += 1) {
			const message = this.state.latestMessages[i];
			if (message.created_at > lastRead && this._countMessageAsUnread(message)) {
				count++;
			}
		}
		return count;
	}

	/**
	 * query - Query the API, get messages, members or other channel fields
	 *
	 * @param {ChannelQueryOptions<OneChatGenerics>} options The query options
	 * @param {MessageSetType} messageSetToAddToIfDoesNotExist It's possible to load disjunct sets of a channel's messages into state, use `current` to load the initial channel state or if you want to extend the currently displayed messages, use `latest` if you want to load/extend the latest messages, `new` is used for loading a specific message and it's surroundings
	 *
	 * @return {Promise<QueryChannelAPIResponse<OneChatGenerics>>} Returns a query response
	 */
	async query(
		_options: ChannelQueryOptions<OneChatGenerics>,
		messageSetToAddToIfDoesNotExist?: MessageSetType,
	): Promise<QueryChannelAPIResponse<OneChatGenerics>> {
    console.warn('channel.query')
		// // Make sure we wait for the connect promise if there is a pending one
		// await this.getClient().wsPromise;

		// let queryURL = `${this.getClient().baseURL}/channels/${this.type}`;
		// if (this.id) {
		//   queryURL += `/${this.id}`;
		// }

		// const state = await this.getClient().post<QueryChannelAPIResponse<OneChatGenerics>>(queryURL + '/query', {
		//   data: this._data,
		//   state: true,
		//   ...options,
		// });

		const id = this.id ?? nanoid()
		const cid = `${this.type}:${id}`
		const members: ChannelMemberResponse<OneChatGenerics>[] = this.data?.members?.map(member => {
			return typeof member === 'string' ? { user_id: member } : member
		}) ?? []

		const state: QueryChannelAPIResponse<OneChatGenerics> = {
			duration: "",
			channel: {
				id,
				cid,
				type: this.type,
				disabled: false,
				frozen: false,
				config: this.getConfig(),
				own_capabilities: [
					'upload-file', // 允许上传文件
				],
			},
			members,
			messages: [],
			pinned_messages: [],
		}

		// update the channel id if it was missing
		if (!this.id) {
			this.id = state.channel.id;
			this.cid = state.channel.cid;
			// set the channel as active...

			const membersStr = state.members
				.map((member) => member.user_id || member.user?.id)
				.sort()
				.join(',');
			const tempChannelCid = `${this.type}:!members-${membersStr}`;

			if (tempChannelCid in this.getClient().activeChannels) {
				// This gets set in `client.channel()` function, when channel is created
				// using members, not id.
				delete this.getClient().activeChannels[tempChannelCid];
			}

			if (!(this.cid in this.getClient().activeChannels)) {
				this.getClient().activeChannels[this.cid] = this;
			}
		}

		// this.getClient()._addChannelConfig(state.channel);

		// add any messages to our channel state
		const { messageSet } = this._initializeState(state, messageSetToAddToIfDoesNotExist);

		this.data = state.channel;
		this.offlineMode = false;

		this.getClient().dispatchEvent({
			type: 'channels.queried',
			queriedChannels: {
				channels: [state],
				isLatestMessageSet: messageSet.isLatest,
			},
		});

		return state;
	}

	/**
	 * on - Listen to events on this channel.
	 *
	 * channel.on('message.new', event => {console.log("my new message", event, channel.state.messages)})
	 * or
	 * channel.on(event => {console.log(event.type)})
	 *
	 * @param {EventHandler<OneChatGenerics> | string } callbackOrString  The event type to listen for (optional)
	 * @param {EventHandler<OneChatGenerics>} [callbackOrNothing] The callback to call
	 */
	on(
		callbackOrString: EventHandler<OneChatGenerics> | string,
		callbackOrNothing?: EventHandler<OneChatGenerics>,
	): { unsubscribe: () => void } {
		const key = callbackOrNothing ? (callbackOrString as string) : 'all';
		const callback = callbackOrNothing ? callbackOrNothing : callbackOrString;
		if (!(key in this.listeners)) {
			this.listeners[key] = [];
		}

		this.listeners[key].push(callback);

		return {
			unsubscribe: () => {
				this.listeners[key] = this.listeners[key].filter((el) => el !== callback);
			},
		};
	}

	/**
	 * off - Remove the event handler
	 *
	 */
	off(
		callbackOrString: EventHandler<OneChatGenerics> | string,
		callbackOrNothing?: EventHandler<OneChatGenerics>,
	): void {
		const key = callbackOrNothing ? (callbackOrString as string) : 'all';
		const callback = callbackOrNothing ? callbackOrNothing : callbackOrString;
		if (!(key in this.listeners)) {
			this.listeners[key] = [];
		}
		this.listeners[key] = this.listeners[key].filter((value) => value !== callback);
	}

	dispatchEvent(event: Event<OneChatGenerics>) {
		const channel = this;
		// gather and call the listeners
		const listeners = [];
		if (channel.listeners.all) {
			listeners.push(...channel.listeners.all);
		}
		if (channel.listeners[event.type]) {
			listeners.push(...channel.listeners[event.type]);
		}

		// call the event and send it to the listeners
		for (const listener of listeners) {
			if (typeof listener !== 'string') {
				listener(event);
			}
		}
	};

	_checkInitialized() {
		if (!this.initialized && !this.offlineMode) {
			throw Error(
				`Channel ${this.cid} hasn't been initialized yet. Make sure to call .watch() and wait for it to resolve`,
			);
		}
	}

	// eslint-disable-next-line sonarjs/cognitive-complexity
	_initializeState(
		state: ChannelAPIResponse<OneChatGenerics>,
		messageSetToAddToIfDoesNotExist: MessageSetType = 'latest',
	) {
		// const { state: clientState, user, userID } = this.getClient();

		// // add the Users
		// if (state.members) {
		// 	for (const member of state.members) {
		// 		if (member.user) {
		// 			clientState.updateUserReference(member.user, this.cid);
		// 		}
		// 	}
		// }

		this.state.membership = state.membership || {};

		const messages = state.messages || [];
		// if (!this.state.messages) {
		// 	this.state.initMessages();
		// }
		const { messageSet } = this.state.addMessagesSorted(messages, false, true, true, messageSetToAddToIfDoesNotExist);

		if (!this.state.pinnedMessages) {
			this.state.pinnedMessages = [];
		}
		// this.state.addPinnedMessages(state.pinned_messages || []);
		// if (state.pending_messages) {
		// 	this.state.pending_messages = state.pending_messages;
		// }
		this.state.watcher_count = state.watcher_count || 0;
		// convert the arrays into objects for easier syncing...
		if (state.watchers) {
			for (const watcher of state.watchers) {
				if (watcher) {
					// clientState.updateUserReference(watcher, this.cid);
					this.state.watchers[watcher.id] = watcher;
				}
			}
		}

		// initialize read state to last message or current time if the channel is empty
		// if the user is a member, this value will be overwritten later on otherwise this ensures
		// that everything up to this point is not marked as unread
		// if (userID != null) {
		// 	const last_read = this.state.last_message_at || new Date();
		// 	if (user) {
		// 		this.state.read[user.id] = {
		// 			user,
		// 			last_read,
		// 			unread_messages: 0,
		// 		};
		// 	}
		// }

		// apply read state if part of the state
		if (state.read) {
			for (const read of state.read) {
				this.state.read[read.user.id] = {
					last_read: new Date(read.last_read),
					// last_read_message_id: read.last_read_message_id,
					unread_messages: read.unread_messages ?? 0,
					user: read.user,
				};

				// if (read.user.id === user?.id) {
				// 	this.state.unreadCount = this.state.read[read.user.id].unread_messages;
				// }
			}
		}

		if (state.members) {
			this.state.members = state.members.reduce((acc, member) => {
				if (member.user) {
					acc[member.user.id] = member;
				}
				return acc;
			}, {} as ChannelState<OneChatGenerics>['members']);
		}

		return {
			messageSet,
		};
	}

	_countMessageAsUnread(message: FormatMessageResponse<OneChatGenerics> | MessageResponse<OneChatGenerics>) {
		if (message.shadowed) return false;
		if (message.silent) return false;
		if (message.parent_id && !message.show_in_channel) return false;
		if (message.user?.id === this.getClient().userID) return false;
		// if (message.user?.id && this.getClient().userMuteStatus(message.user.id)) return false;
		if (message.type === 'system') return false;

		// Return false if channel doesn't allow read events.
		if (Array.isArray(this.data?.own_capabilities) && !this.data?.own_capabilities.includes('read-events'))
			return false;

		if (this.muteStatus().muted) return false;

		return true;
	}

}
