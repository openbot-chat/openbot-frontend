import type {
	Client as IClient,
	DefaultOneChatGenerics,
	APIResponse,
	AppSettingsAPIResponse,
	OwnUserResponse,
	UserResponse,
	Event,
	EventHandler,
	UserFilters,
	UserSort,
	UserOptions,
	Channel as IChannel,
	ChannelSort,
	ChannelFilters,
	ChannelOptions,
	ChannelStateOptions,
	ChannelData,
	MuteUserOptions,
	MuteUserResponse,
	UpdatedMessage,
	UpdateMessageAPIResponse,
	MessageResponse,
	GetMessageAPIResponse,
} from '@openbot/aibot-uikit/dist/types'
import { Channel } from './channel'



export type ClientOptions = {
	baseURL?: string;
}

export type DefaultChatGenerics = DefaultOneChatGenerics & {
	eventType: {
		message_id?: string,
		sentence?: string
	}
}

export class Client<OneChatGenerics extends DefaultChatGenerics = DefaultChatGenerics> implements IClient<OneChatGenerics> {
	baseURL?: string;
	user?: OwnUserResponse<OneChatGenerics> | UserResponse<OneChatGenerics>;
	userID?: string;
	activeChannels: {
		[key: string]: IChannel<OneChatGenerics>;
	};
	listeners: Record<string, Array<(event: Event<OneChatGenerics>) => void>>;
	userAgent?: string;

	constructor(options?: ClientOptions) {
		this.baseURL = options?.baseURL || 'https://api.openbot.chat/web/v1';
		this.user = { id: "" }
		this.userID = ""
		// keeps a reference to all the channels that are in use
		this.activeChannels = {};
		this.listeners = {}
	}

	async getAppSettings(): Promise<AppSettingsAPIResponse<OneChatGenerics>> {
		return {
			duration: '',
		}
	}

	/**
	 * on - Listen to events on all channels and users your watching
	 *
	 * client.on('message.new', event => {console.log("my new message", event, channel.state.messages)})
	 * or
	 * client.on(event => {console.log(event.type)})
	 *
	 * @param {EventHandler<OneChatGenerics> | string} callbackOrString  The event type to listen for (optional)
	 * @param {EventHandler<OneChatGenerics>} [callbackOrNothing] The callback to call
	 *
	 * @return {{ unsubscribe: () => void }} Description
	 */
	on(
		callbackOrString: EventHandler<OneChatGenerics> | string,
		callbackOrNothing?: EventHandler<OneChatGenerics>,
	): { unsubscribe: () => void } {
		const key = callbackOrNothing ? (callbackOrString as string) : 'all';
		const callback = callbackOrNothing ? callbackOrNothing : (callbackOrString as EventHandler<OneChatGenerics>);
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
	 */
	off(
		callbackOrString: EventHandler<OneChatGenerics> | string,
		callbackOrNothing?: EventHandler<OneChatGenerics>,
	) {
		const key = callbackOrNothing ? (callbackOrString as string) : 'all';
		const callback = callbackOrNothing ? callbackOrNothing : (callbackOrString as EventHandler<OneChatGenerics>);
		if (!(key in this.listeners)) {
			this.listeners[key] = [];
		}
		this.listeners[key] = this.listeners[key].filter((value) => value !== callback);
	}

	dispatchEvent = (event: Event<OneChatGenerics>) => {
		if (!event.received_at) event.received_at = new Date();

		const client = this;
		// gather and call the listeners
		const listeners: Array<(event: Event<OneChatGenerics>) => void> = [];
		if (client.listeners.all) {
			listeners.push(...client.listeners.all);
		}
		if (client.listeners[event.type]) {
			listeners.push(...client.listeners[event.type]);
		}

		// call the event and send it to the listeners
		for (const listener of listeners) {
			listener(event);
		}

		const cid = event.cid;
		const channel = cid ? this.activeChannels[cid] : undefined;
		if (channel) {
			channel.dispatchEvent(event);
		}
	};

	/**
	 * queryUsers - Query users and watch user presence
	 *
	 * @param {UserFilters<OneChatGenerics>} filterConditions MongoDB style filter conditions
	 * @param {UserSort<OneChatGenerics>} sort Sort options, for instance [{last_active: -1}].
	 * When using multiple fields, make sure you use array of objects to guarantee field order, for instance [{last_active: -1}, {created_at: 1}]
	 * @param {UserOptions} options Option object, {presence: true}
	 *
	 * @return {Promise<{ users: Array<UserResponse<OneChatGenerics>> }>} User Query Response
	 */
	async queryUsers(_filterConditions: UserFilters<OneChatGenerics>, _sort?: UserSort<OneChatGenerics>, _options?: UserOptions): Promise<{
		users: Array<UserResponse<OneChatGenerics>>;
	}> {
		throw new Error('unimplemented client method `queryUsers`')
	}

	/**
	 * queryChannels - Query channels
	 *
	 * @param {ChannelFilters<OneChatGenerics>} filterConditions object MongoDB style filters
	 * @param {ChannelSort<OneChatGenerics>} [sort] Sort options, for instance {created_at: -1}.
	 * When using multiple fields, make sure you use array of objects to guarantee field order, for instance [{last_updated: -1}, {created_at: 1}]
	 * @param {ChannelOptions} [options] Options object
	 * @param {ChannelStateOptions} [stateOptions] State options object. These options will only be used for state management and won't be sent in the request.
	 * - stateOptions.skipInitialization - Skips the initialization of the state for the channels matching the ids in the list.
	 *
	 * @return {Promise<{ channels: Array<ChannelAPIResponse<OneChatGenerics>>}> } search channels response
	 */
	async queryChannels(
		_filterConditions: ChannelFilters<OneChatGenerics>,
		_sort?: ChannelSort<OneChatGenerics>,
		_options?: ChannelOptions,
		_stateOptions?: ChannelStateOptions
	): Promise<Array<IChannel<OneChatGenerics>>> {
		throw new Error('unimplemented client method `queryChannels`')
	}

	/**
	 * channel - Returns a new channel with the given type, id and custom data
	 *
	 * If you want to create a unique conversation between 2 or more users; you can leave out the ID parameter and provide the list of members.
	 * Make sure to await channel.create() or channel.watch() before accessing channel functions:
	 * ie. channel = client.channel("messaging", {members: ["tommaso", "thierry"]})
	 * await channel.create() to assign an ID to channel
	 *
	 * @param {string} channelType The channel type
	 * @param {string | ChannelData<OneChatGenerics> | null} [channelIDOrCustom]   The channel ID, you can leave this out if you want to create a conversation channel
	 * @param {object} [custom]    Custom data to attach to the channel
	 *
	 * @return {channel} The channel object, initialize it using channel.watch()
	 */
	channel(
		channelType: string,
		channelIDOrCustom?: string | ChannelData<OneChatGenerics> | null,
		custom: ChannelData<OneChatGenerics> & { agent: any } = {} as ChannelData<OneChatGenerics> & { agent: any }
	): IChannel<OneChatGenerics> {
		// support channel("messaging", null, {options})
		// support channel("messaging", undefined, {options})
		// support channel("messaging", "", {options})
		if (channelIDOrCustom == null || channelIDOrCustom === '') {
			return new Channel<OneChatGenerics>(this, channelType, undefined, custom);
		}

		// support channel("messaging", {options})
		if (typeof channelIDOrCustom === 'object') {
			return this.getChannelByMembers(channelType, channelIDOrCustom);
		}

		return this.getChannelById(channelType, channelIDOrCustom, custom);
	}

	/**
	 * It's a helper method for `client.channel()` method, used to create unique conversation or
	 * channel based on member list instead of id.
	 *
	 * If the channel already exists in `activeChannels` list, then we simply return it, since that
	 * means the same channel was already requested or created.
	 *
	 * Otherwise we create a new instance of Channel class and return it.
	 *
	 * @private
	 *
	 * @param {string} channelType The channel type
	 * @param {object} [custom]    Custom data to attach to the channel
	 *
	 * @return {channel} The channel object, initialize it using channel.watch()
	 */
	getChannelByMembers(channelType: string, custom: ChannelData<OneChatGenerics>) {
		// Check if the channel already exists.
		// Only allow 1 channel object per cid
		const membersStr = [...(custom.members || [])].sort().join(',');
		const tempCid = `${channelType}:!members-${membersStr}`;

		if (!membersStr) {
			throw Error('Please specify atleast one member when creating unique conversation');
		}

		// channel could exist in `activeChannels` list with either one of the following two keys:
		// 1. cid - Which gets set on channel only after calling channel.query or channel.watch or channel.create
		// 2. Sorted membersStr - E.g., "messaging:amin,vishal" OR "messaging:amin,jaap,tom"
		//                        This is set when you create a channel, but haven't queried yet. After query,
		//                        we will replace it with `cid`
		for (const key in this.activeChannels) {
			const channel = this.activeChannels[key];
			if (channel.disconnected) {
				continue;
			}

			if (key === tempCid) {
				return channel;
			}

			if (key.indexOf(`${channelType}:!members-`) === 0) {
				const membersStrInExistingChannel = Object.keys(channel.state.members).sort().join(',');
				if (membersStrInExistingChannel === membersStr) {
					return channel;
				}
			}
		}

		const channel = new Channel<OneChatGenerics>(this, channelType, undefined, custom);

		// For the time being set the key as membersStr, since we don't know the cid yet.
		// In channel.query, we will replace it with 'cid'.
		this.activeChannels[tempCid] = channel;
		return channel;
	};

	/**
	 * Its a helper method for `client.channel()` method, used to channel given the id of channel.
	 *
	 * If the channel already exists in `activeChannels` list, then we simply return it, since that
	 * means the same channel was already requested or created.
	 *
	 * Otherwise we create a new instance of Channel class and return it.
	 *
	 * @private
	 *
	 * @param {string} channelType The channel type
	 * @param {string} [channelID] The channel ID
	 * @param {object} [custom]    Custom data to attach to the channel
	 *
	 * @return {channel} The channel object, initialize it using channel.watch()
	 */
	getChannelById = (channelType: string, channelID: string, custom: ChannelData<OneChatGenerics> & { agent: any }) => {
		if (typeof channelID === 'string' && ~channelID.indexOf(':')) {
			throw Error(`Invalid channel id ${channelID}, can't contain the : character`);
		}

		// only allow 1 channel object per cid
		const cid = `${channelType}:${channelID}`;
		if (cid in this.activeChannels && !this.activeChannels[cid].disconnected) {
			const channel = this.activeChannels[cid];
			if (Object.keys(custom).length > 0) {
				// channel.data = custom;
				channel._data = custom;
			}
			return channel;
		}
		const channel = new Channel<OneChatGenerics>(this, channelType, channelID, custom);
		this.activeChannels[channel.cid] = channel;

		return channel;
	};

	/** muteUser - mutes a user
	 *
	 * @param {string} targetID
	 * @param {string} [userID] Only used with serverside auth
	 * @param {MuteUserOptions<OneChatGenerics>} [options]
	 * @returns {Promise<MuteUserResponse<OneChatGenerics>>}
	 */
	async muteUser(_targetID: string, _userID?: string, _options?: MuteUserOptions<OneChatGenerics>): Promise<MuteUserResponse<OneChatGenerics>> {
		throw new Error('unimplemented client method `muteUser`')
	}

	/** unmuteUser - unmutes a user
	 *
	 * @param {string} targetID
	 * @param {string} [currentUserID] Only used with serverside auth
	 * @returns {Promise<APIResponse>}
	 */
	async unmuteUser(_targetID: string, _currentUserID?: string): Promise<APIResponse> {
		throw new Error('unimplemented client method `unmuteUser`')
	}

	/**
	 * flagMessage - flag a message
	 * @param {string} targetMessageID
	 * @param {string} [options.user_id] currentUserID, only used with serverside auth
	 * @returns {Promise<APIResponse>}
	 */
	async flagMessage(_targetMessageID: string, _options?: {
		user_id?: string;
	}): Promise<APIResponse> {
		throw new Error('unimplemented client method `flagMessage`')
	}

	/**
	 * unflagMessage - unflag a message
	 * @param {string} targetMessageID
	 * @param {string} [options.user_id] currentUserID, only used with serverside auth
	 * @returns {Promise<APIResponse>}
	 */
	async unflagMessage(_targetMessageID: string, _options?: {
		user_id?: string;
	}): Promise<APIResponse> {
		throw new Error('unimplemented client method `unflagMessage`')
	}

	/**
	 * pinMessage - pins the message
	 * @param {string | { id: string }} messageOrMessageId message object or message id
	 * @param {undefined|null|number|string|Date} timeoutOrExpirationDate expiration date or timeout. Use number type to set timeout in seconds, string or Date to set exact expiration date
	 * @param {undefined|string | { id: string }} [pinnedBy] who will appear as a user who pinned a message. Only for server-side use. Provide `undefined` when pinning message client-side
	 * @param {undefined|number|string|Date} pinnedAt date when message should be pinned. It affects the order of pinned messages. Use negative number to set relative time in the past, string or Date to set exact date of pin
	 */
	async pinMessage(_messageOrMessageId: string | {
		id: string;
	}, _timeoutOrExpirationDate?: null | number | string | Date, _pinnedBy?: string | {
		id: string;
	}, _pinnedAt?: number | string | Date): Promise<UpdateMessageAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented client method `pinMessage`')
	}

	/**
	 * unpinMessage - unpins the message that was previously pinned
	 * @param {string | { id: string }} messageOrMessageId message object or message id
	 * @param {string | { id: string }} [userId]
	 */
	async unpinMessage(_messageOrMessageId: string | {
		id: string;
	}, _userId?: string | {
		id: string;
	}): Promise<UpdateMessageAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented client method `unpinMessage`')
	}

	/**
	 * updateMessage - Update the given message
	 *
	 * @param {Omit<MessageResponse<OneChatGenerics>, 'mentioned_users'> & { mentioned_users?: string[] }} message object, id needs to be specified
	 * @param {string | { id: string }} [userId]
	 * @param {boolean} [options.skip_enrich_url] Do not try to enrich the URLs within message
	 *
	 * @return {{ message: MessageResponse<OneChatGenerics> }} Response that includes the message
	 */
	async updateMessage(_message: UpdatedMessage<OneChatGenerics>, _userId?: string | {
		id: string;
	}, _options?: {
		skip_enrich_url?: boolean;
	}): Promise<UpdateMessageAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented client method `updateMessage`')
	}

	async deleteMessage(_messageID: string, _hardDelete?: boolean): Promise<APIResponse & {
		message: MessageResponse<OneChatGenerics>;
	}> {
		throw new Error('unimplemented client method `deleteMessage`')
	}

	async getMessage(_messageID: string): Promise<GetMessageAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented client method `getMessage`')
	}

	getUserAgent(): string {
		return (
			this.userAgent || `openbot-embeds-javascript-client`
		);
	}

	setUserAgent(userAgent: string) {
		this.userAgent = userAgent;
	}

	hash(): string {
		return ""
	}
}