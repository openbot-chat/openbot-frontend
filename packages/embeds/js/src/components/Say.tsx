import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { Channel, EventHandler } from '@openbot/aibot-uikit/dist/types'
import { DefaultChatGenerics } from '../client'
import { say } from '../queries/sayQuery'
import { Agent } from '../types'
import { nanoid } from 'nanoid'

type SayProps<ChatGenerics extends DefaultChatGenerics> = {
	agent: Agent
	channel: Channel<ChatGenerics>
	apiHost?: string
}

type Sentence = {
	id: string
	text: string
	voice?: string
	error?: unknown
}

type Stream = {
	id: string,
	closed: boolean
	sentences: Sentence[]
}

type SayState = {
	streams: Stream[]
	// 当前是否播放中 
	isPlaying: boolean
	// 当前播放的stream
	streamId?: string
	// 当前播放的句子
	sentenceId?: string
}

const initialSayState: SayState = {
	streams: [],
	isPlaying: false,
	streamId: undefined,
	sentenceId: undefined
}

type SayAction =
	| {
		type: 'new_stream'
		id: string
	}
	| {
		type: 'close_stream'
		id: string
	}
	| {
		type: 'new_sentence'
		id: string
		sentenceId: string
		text: string
	}
	| {
		type: 'say_complete'
		id: string
		sentenceId: string
		voice?: string
		error?: unknown
	}
	| {
		type: 'play_next'
	}
	| {
		type: 'play_complete'
	}
	| {
		type: 'reset'
	};

const reducer = (state: SayState, action: SayAction): SayState => {
	switch (action.type) {
		case 'new_stream': {
			return {
				...state,
				streams: [...state.streams, {
					id: action.id,
					closed: false,
					sentences: []
				}]
			}
		}

		case 'new_sentence': {
			const streams = [...state.streams]
			const idx = streams.findIndex(s => s.id === action.id)
			if (idx < 0) {
				console.warn(`stream already closed ${action.id}`)
				return state
			}
			const stream = streams[idx]
			stream.sentences.push({
				id: action.sentenceId,
				text: action.text
			})
			return { ...state, streams }
		}

		case 'say_complete': {
			const streams = [...state.streams]
			const idx = streams.findIndex(s => s.id === action.id)
			if (idx < 0) {
				console.warn(`stream already closed ${action.id}`)
				return state
			}
			const stream = streams[idx]
			const idx2 = stream.sentences.findIndex(s => s.id === action.sentenceId)
			if (idx2 < 0) {
				console.warn(`stream sentence not exist ${action.id}`)
				return state
			}
			stream.sentences[idx2].voice = action.voice
			stream.sentences[idx2].error = action.error
			return { ...state, streams }
		}

		case 'close_stream': {
			const streams = [...state.streams]
			const idx = streams.findIndex(s => s.id === action.id)
			if (idx < 0) {
				console.warn(`stream already closed ${action.id}`)
				return state
			}
			streams[idx].closed = true
			return { ...state, streams }
		}

		case 'play_next': {
			// 正在播放中
			if (state.isPlaying) return state
			// 还没有回复
			if (state.streams.length === 0) return state

			if (state.streamId === undefined) {
				// 初始播放语音
				return startSaying(state)
			}
			// 播放下一个句子
			return sayNextSentence(state)
		}

		case 'play_complete': {
			return {
				...state,
				isPlaying: false
			}
		}

		case 'reset': {
			return { ...initialSayState }
		}
	}
}

const startSaying = (state: SayState): SayState => {
	const { streams } = state
	// 找到第一个可以播放的stream: stream还在推送答复，或者stream有可以播放的句子
	const stream = streams.find(s => !s.closed || s.sentences.some(s2 => !s2.error))
	if (!stream) {
		// 还没有能够播放的stream，继续等待
		return {
			...state,
			isPlaying: false,
			streamId: undefined,
			sentenceId: undefined
		}
	}
	// 找到第一个已经生成语音的句子进行播放
	const { sentences } = stream
	const sentence = sentences.find(s => !s.error)
	if (sentence?.voice) {
		return {
			...state,
			isPlaying: true,
			streamId: stream.id,
			sentenceId: sentence.id
		}
	} else {
		// 句子还没准备好
		return {
			...state,
			isPlaying: false,
			streamId: undefined,
			sentenceId: undefined
		}
	}
}

const sayNextSentence = (state: SayState): SayState => {
	const { streams, streamId, sentenceId } = state
	// 上次播放的stream
	const streamIdx = streams.findIndex(s => s.id === streamId)
	if (streamIdx < 0) {
		console.warn(`current stream not found ${streamId}`)
		return {
			...state,
			isPlaying: false,
			streamId: undefined,
			sentenceId: undefined
		}
	}
	const stream = streams[streamIdx]

	if (sentenceId === undefined) {
		// 从头开始读stream
		return startSayingStream(stream, state)
	}

	const { sentences } = stream
	// 上次播放的句子
	const sentenceIdx = sentences.findIndex(s => s.id === sentenceId)
	if (sentenceIdx < 0) {
		console.warn(`current sentence not found ${sentenceId}`)
		return {
			...state,
			isPlaying: false,
			streamId: stream.id,
			sentenceId: undefined
		}
	}
	const sentence = sentences[sentenceIdx]

	// 找当前stream的下一个句子
	const nextSentence = sentences.slice(sentenceIdx + 1).find(s => !s.error)

	if (nextSentence?.voice) {
		// 下个句子语音已经准备好，可以播放
		return {
			...state,
			isPlaying: true,
			streamId: stream.id,
			sentenceId: nextSentence.id
		}
	}

	if (nextSentence) {
		// 下个句子语音还没准备好，继续等待
		return {
			...state,
			isPlaying: false,
			streamId: stream.id,
			sentenceId: sentence.id
		}
	}

	// 没有下个句子，stream还在推送中，继续等待
	if (!stream.closed) {
		return {
			...state,
			isPlaying: false,
			streamId: stream.id,
			sentenceId: sentence.id
		}
	}

	// 当前stream也结束了，播放下一个stream
	const nextStream = streams.slice(streamIdx + 1).find(s => !s.closed || s.sentences.some(s2 => !s2.error))
	if (nextStream) {
		return startSayingStream(nextStream, state)
	} else {
		// 后面的stream还没准备好，继续等待
		return {
			...state,
			isPlaying: false,
			streamId: stream.id,
			sentenceId: sentence.id
		}
	}
}

const startSayingStream = (stream: Stream, state: SayState): SayState => {
	const { sentences } = stream
	// 找到第一句
	const sentence = sentences.find(s => !s.error)
	if (sentence?.voice) {
		// 语音已经生成，可以播放
		return {
			...state,
			isPlaying: true,
			streamId: stream.id,
			sentenceId: sentence.id
		}
	} else {
		// 语音还没生成，要继续等待
		return {
			...state,
			isPlaying: false,
			streamId: stream.id,
			sentenceId: undefined
		}
	}
}

export const Say = <ChatGenerics extends DefaultChatGenerics = DefaultChatGenerics>({
	agent,
	channel,
	apiHost,
}: SayProps<ChatGenerics>) => {
	// 待播队列，按照回复消息的顺序，依次播放句子
	const [state, dispatch] = useReducer(reducer, { ...initialSayState })

	// 新的消息流
	const onNewStream: EventHandler<ChatGenerics> = useCallback((evt) => {
		dispatch({ type: 'new_stream', id: evt.message_id! })
	}, [dispatch])

	// 消息流有新的句子
	const onNewSentence: EventHandler<ChatGenerics> = useCallback(async (evt) => {
		const id = evt.message_id!
		const sentenceId = nanoid()
		const text = evt.sentence!
		dispatch({
			type: 'new_sentence',
			id,
			sentenceId,
			text
		})

		// 文字转语音
		try {
			const sayResp = await say({
				agent,
				text,
				apiHost
			})
			dispatch({
				type: 'say_complete',
				id,
				sentenceId,
				voice: sayResp.data
			})
		} catch (error: unknown) {
			dispatch({
				type: 'say_complete',
				id,
				sentenceId,
				error
			})
		}
		// 尝试播放
		// 让页面先渲染以便重建 audio
		setTimeout(() => {
			dispatch({
				type: 'play_next'
			})
		}, 10)
	}, [agent.id, dispatch])

	// 消息流结束
	const onStreamClosed: EventHandler<ChatGenerics> = useCallback((evt) => {
		dispatch({ type: 'close_stream', id: evt.message_id! })
	}, [dispatch])

	useEffect(() => {
		// 切换会话清理未播的语音
		dispatch({ type: 'reset' })
	}, [channel])

	useEffect(() => {
		const { unsubscribe: unsubscribe1 } = channel.on('message_stream.new_sentence', onNewSentence)
		const { unsubscribe: unsubscribe2 } = channel.on('message_stream.closed', onStreamClosed)
		const { unsubscribe: unsubscribe3 } = channel.on('message_stream.opened', onNewStream)
		return () => {
			unsubscribe1()
			unsubscribe2()
			unsubscribe3()
		}
	}, [channel, onNewSentence, onNewStream, onStreamClosed])

	const onAudioEnd = useCallback(() => {
		dispatch({ type: 'play_complete' })
		// 让页面先渲染以便重建 audio
		setTimeout(() => {
			dispatch({ type: 'play_next' })
		}, 10)
	}, [dispatch])

	const voice = useMemo(() => {
		const { streams, streamId, sentenceId } = state
		if (!streamId || !sentenceId) return ''
		const stream = streams.find(s => s.id === streamId)
		const sentence = stream?.sentences?.find(s => s.id === sentenceId)
		return `data:audio/mp3;base64,${sentence?.voice}`
	}, [state.streams, state.streamId, state.sentenceId])

	if (!state.isPlaying) {
		return <></>
	}

	return (
		<audio autoPlay onEnded={onAudioEnd}>
			<source src={voice} />
		</audio>
	)

}