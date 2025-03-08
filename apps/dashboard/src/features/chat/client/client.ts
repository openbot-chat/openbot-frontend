import {
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
  QueryChannelsAPIResponse,
  ErrorFromResponse,
  APIErrorResponse,
  ChannelAPIResponse,
  ChannelResponse,
  Configs,
} from '@openbot/aibot-uikit/dist/types'
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Channel } from './channel'
import { isErrorResponse } from './errors';

export type ClientOptions = {
	baseURL?: string;
}

export class Client<OneChatGenerics extends DefaultOneChatGenerics = DefaultOneChatGenerics> implements IClient<OneChatGenerics> {
  axiosInstance: AxiosInstance;
  baseURL?: string;
	user?: OwnUserResponse<OneChatGenerics> | UserResponse<OneChatGenerics>;
	userID?: string;
	activeChannels: {
		[key: string]: IChannel<OneChatGenerics>;
	};
	listeners: Record<string, Array<(event: Event<OneChatGenerics>) => void>>;
	userAgent?: string;
  options: AxiosRequestConfig
  consecutiveFailures: number;
  configs: Configs<OneChatGenerics>;

	constructor(options?: ClientOptions) {
		this.baseURL = options?.baseURL || 'https://api.openbot.chat/web/v1';
		this.user = { id: "" }
		this.userID = ""
		// keeps a reference to all the channels that are in use
		this.activeChannels = {};
    this.configs = {};
		this.listeners = {}
    

    this.options = {
      timeout: 3000,
      withCredentials: false, // making sure cookies are not sent
      // warmUp: false,
      // recoverStateOnReconnect: true,
      // ...inputOptions,
    };

    /*
    if (this.node && !this.options.httpsAgent) {
      this.options.httpsAgent = new https.Agent({
        keepAlive: true,
        keepAliveMsecs: 3000,
      });
    }*/

    this.axiosInstance = axios.create(this.options);

    this.consecutiveFailures = 0;
	}

	async getAppSettings(): Promise<AppSettingsAPIResponse<OneChatGenerics>> {
		throw new Error('unimplemented client method `getAppSettings`')
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

  _handleClientEvent(event: Event<OneChatGenerics>) {
    // const client = this;
    const postListenerCallbacks = [];
    /*
    this.logger('info', `client:_handleClientEvent - Received event of type { ${event.type} }`, {
      tags: ['event', 'client'],
      event,
    });
    */

    /*
    if (event.type === 'user.presence.changed' || event.type === 'user.updated' || event.type === 'user.deleted') {
      this._handleUserEvent(event);
    }
    */

    /*
    if (event.type === 'health.check' && event.me) {
      client.user = event.me;
      client.state.updateUser(event.me);
      client.mutedChannels = event.me.channel_mutes;
      client.mutedUsers = event.me.mutes;
    }
    */

    /*
    if (event.channel && event.type === 'notification.message_new') {
      this._addChannelConfig(event.channel);
    }
    */

    /*
    if (event.type === 'notification.channel_mutes_updated' && event.me?.channel_mutes) {
      const currentMutedChannelIds: string[] = [];
      const nextMutedChannelIds: string[] = [];

      this.mutedChannels.forEach((mute) => mute.channel && currentMutedChannelIds.push(mute.channel.cid));
      event.me.channel_mutes.forEach((mute) => mute.channel && nextMutedChannelIds.push(mute.channel.cid));

      // Set the unread count of un-muted channels to 0, which is the behaviour of backend
      currentMutedChannelIds.forEach((cid) => {
        if (!nextMutedChannelIds.includes(cid) && this.activeChannels[cid]) {
          this.activeChannels[cid].state.unreadCount = 0;
        }
      });

      this.mutedChannels = event.me.channel_mutes;
    }
    */

    /*
    if (event.type === 'notification.mutes_updated' && event.me?.mutes) {
      this.mutedUsers = event.me.mutes;
    }
    */

    /*
    if (event.type === 'notification.mark_read' && event.unread_channels === 0) {
      const activeChannelKeys = Object.keys(this.activeChannels);
      activeChannelKeys.forEach((activeChannelKey) => (this.activeChannels[activeChannelKey].state.unreadCount = 0));
    }
    */

    /*
    if ((event.type === 'channel.deleted' || event.type === 'notification.channel_deleted') && event.cid) {
      client.state.deleteAllChannelReference(event.cid);
      this.activeChannels[event.cid]?._disconnect();

      postListenerCallbacks.push(() => {
        if (!event.cid) return;

        delete this.activeChannels[event.cid];
      });
    }
    */

    return postListenerCallbacks;
  }

  _callClientListeners = (event: Event<OneChatGenerics>) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
  };

	dispatchEvent = (event: Event<OneChatGenerics>) => {
		if (!event.received_at) event.received_at = new Date();

    // client event handlers
    const postListenerCallbacks = this._handleClientEvent(event);

		// channel event handlers
    const cid = event.cid;
    const channel = cid ? this.activeChannels[cid] : undefined;
    if (channel) {
      channel._handleChannelEvent(event);
    }

    this._callClientListeners(event);

    if (channel) {
      channel._callChannelListeners(event);
    }

    postListenerCallbacks.forEach((c) => c());
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
		filterConditions: ChannelFilters<OneChatGenerics>,
		sort?: ChannelSort<OneChatGenerics>,
		options?: ChannelOptions,
		stateOptions?: ChannelStateOptions
	): Promise<Array<IChannel<OneChatGenerics>>> {
		const defaultOptions: ChannelOptions = {
      state: true,
      watch: true,
      presence: false,
    };

    // Make sure we wait for the connect promise if there is a pending one
    /*
    await this.wsPromise;
    if (!this._hasConnectionID()) {
      defaultOptions.watch = false;
    }*/

    // Return a list of channels
    /*
    const payload = {
      filter_conditions: filterConditions,
      // sort: normalizeQuerySort(sort),
      ...defaultOptions,
      ...options,
    };*/

    console.log('laoshu options: ', options);
    const payload = {
    };

    const data = await this.get<QueryChannelsAPIResponse<OneChatGenerics>>(this.baseURL + '/conversations', payload);

    this.dispatchEvent({
      type: 'channels.queried',
      queriedChannels: {
        channels: data.items,
        isLatestMessageSet: true,
      },
    });

    return this.hydrateActiveChannels(data.items, stateOptions);
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
		custom: ChannelData<OneChatGenerics> = {} as ChannelData<OneChatGenerics>
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
	getChannelById = (channelType: string, channelID: string, custom: ChannelData<OneChatGenerics>) => {
		if (typeof channelID === 'string' && ~channelID.indexOf(':')) {
			throw Error(`Invalid channel id ${channelID}, can't contain the : character`);
		}

		// only allow 1 channel object per cid
		const cid = `${channelType}:${channelID}`;
		if (cid in this.activeChannels && !this.activeChannels[cid].disconnected) {
			const channel = this.activeChannels[cid];
			if (Object.keys(custom).length > 0) {
				channel.data = custom;
				// channel._data = custom;
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

  _addChannelConfig({ cid, config }: ChannelResponse<OneChatGenerics>) {
    this.configs[cid] = config;
  }

  hydrateActiveChannels(
    channelsFromApi: ChannelAPIResponse<OneChatGenerics>[] = [],
    stateOptions: ChannelStateOptions = {},
  ) {
    const { skipInitialization, offlineMode = false } = stateOptions;

    for (const channelState of channelsFromApi) {
      // this._addChannelConfig(channelState.channel);
      this._addChannelConfig(channelState);
    }

    const channels: Channel<OneChatGenerics>[] = [];

    for (const channelState of channelsFromApi) {
      // const c = this.channel(channelState.channel.type, channelState.channel.id);
      const c = this.channel(channelState.type, channelState.id);

      c.data = channelState.channel;
      c.offlineMode = offlineMode;
      c.initialized = !offlineMode;

      if (skipInitialization === undefined) {
        c._initializeState(channelState, 'latest');
      } else if (!skipInitialization.includes(/*channelState.channel.id*/channelState.id)) {
        c.state.clearMessages();
        c._initializeState(channelState, 'latest');
      }

      channels.push(c);
    }

    if (!offlineMode) {
      // If the channels are coming from server, then clear out the
      // previously help offline channels.
      for (const key in this.activeChannels) {
        const channel = this.activeChannels[key];
        if (channel.offlineMode) {
          delete this.activeChannels[key];
        }
      }
    }

    return channels;
  }

  _enrichAxiosOptions(
    options: AxiosRequestConfig & { config?: AxiosRequestConfig } = {
      params: {},
      headers: {},
      config: {},
    },
  ): AxiosRequestConfig {
    return options;
  }

  errorFromResponse(response: AxiosResponse<APIErrorResponse>): ErrorFromResponse<APIErrorResponse> {
    let err: ErrorFromResponse<APIErrorResponse>;
    err = new ErrorFromResponse(`OneChat error HTTP code: ${response.status}`);
    
    if (response.data && response.data.code) {
      err = new Error(`OneChat error code ${response.data.code}: ${response.data.message}`);
      err.code = response.data.code;
    }
    err.response = response;
    err.status = response.status;
    return err;
  }

  handleResponse<T>(response: AxiosResponse<T>) {
    const data = response.data;
    if (isErrorResponse(response)) {
      throw this.errorFromResponse(response);
    }
    return data;
  }

  doAxiosRequest = async <T>(
    type: string,
    url: string,
    data?: unknown,
    options: AxiosRequestConfig & {
      config?: AxiosRequestConfig & { maxBodyLength?: number };
    } = {},
  ): Promise<T> => {
    // await this.tokenManager.tokenReady();
    const requestConfig = this._enrichAxiosOptions(options);
    try {
      let response: AxiosResponse<T>;
      // this._logApiRequest(type, url, data, requestConfig);
      switch (type) {
        case 'get':
          response = await this.axiosInstance.get(url, requestConfig);
          break;
        case 'delete':
          response = await this.axiosInstance.delete(url, requestConfig);
          break;
        case 'post':
          response = await this.axiosInstance.post(url, data, requestConfig);
          break;
        case 'put':
          response = await this.axiosInstance.put(url, data, requestConfig);
          break;
        case 'patch':
          response = await this.axiosInstance.patch(url, data, requestConfig);
          break;
        case 'options':
          response = await this.axiosInstance.options(url, requestConfig);
          break;
        default:
          throw new Error('Invalid request type');
      }
      // this._logApiResponse<T>(type, url, response);
      this.consecutiveFailures = 0;
      return this.handleResponse(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any /**TODO: generalize error types  */) {
      e.client_request_id = requestConfig.headers?.['x-client-request-id'];
      // this._logApiError(type, url, e);
      this.consecutiveFailures += 1;
      if (e.response) {
        /** connection_fallback depends on this token expiration logic */
  
        /*
        if (e.response.data.code === chatCodes.TOKEN_EXPIRED && !this.tokenManager.isStatic()) {
          if (this.consecutiveFailures > 1) {
            await sleep(retryInterval(this.consecutiveFailures));
          }
          // this.tokenManager.loadToken();
          return await this.doAxiosRequest<T>(type, url, data, options);
        }
        */
        return this.handleResponse(e.response);
      } else {
        throw e as AxiosError<APIErrorResponse>;
      }
    }
  };

  get<T>(url: string, params?: AxiosRequestConfig['params']) {
    return this.doAxiosRequest<T>('get', url, null, { params });
  }
}