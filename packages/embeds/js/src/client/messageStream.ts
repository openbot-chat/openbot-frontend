import { Channel } from "./channel"
import { DefaultChatGenerics } from './client'
import type { Event } from '@openbot/aibot-uikit/dist/types';

export class MessageStream<OneChatGenerics extends DefaultChatGenerics = DefaultChatGenerics> {

	channel: Channel<OneChatGenerics>
	sentence: string
	messageId: string
	opened: boolean

	constructor(channel: Channel<OneChatGenerics>) {
		this.channel = channel
		this.sentence = ''
		this.messageId = ''
		this.opened = false
	}

	open(messageId: string) {
		if (this.opened) return
		this.opened = true
		this.messageId = messageId
		const evt = {
			type: 'message_stream.opened',
			message_id: this.messageId
		}
		this.channel.dispatchEvent(evt as Event<OneChatGenerics>)
	}

	close() {
		if (!this.opened) return
		this.opened = false

		// 通知最后一个句子
		if (this.sentence !== '') {
			const evt = {
				type: 'message_stream.new_sentence',
				message_id: this.messageId,
				sentence: this.sentence
			}
			this.channel.dispatchEvent(evt as Event<OneChatGenerics>)

			this.sentence = ''
		}

		// 通知关闭
		const evt = {
			type: 'message_stream.closed',
			message_id: this.messageId
		}
		this.channel.dispatchEvent(evt as Event<OneChatGenerics>)
	}

	append(delta: string) {
		if (!delta) return
		// 分割句子
		const sentence = this.sentence + delta
		const sentences = splitToSentences(sentence)

		// 句子还不完整，继续等待
		if (sentences.length <= 1) {
			this.sentence = sentence
			return
		}

		// 最后一个子句可能还不完整，需要继续等待
		const lastSentence = sentences.pop()!

		// 其他句子是完整的，如果长度不够就合并
		let str = ''
		sentences.forEach(s => {
			str = str + s
			if (str.length >= 10) {
				// 句子完整并且长度够了，通知有新句子
				const evt = {
					type: 'message_stream.new_sentence',
					message_id: this.messageId,
					sentence: str
				}
				this.channel.dispatchEvent(evt as Event<OneChatGenerics>)

				str = ''
			}
		})

		// 句子长度还不够，继续等待
		this.sentence = str + lastSentence
	}
}


const splitToSentences = (str: string): string[] => {
	const sentences: string[] = [] // 分割后的句子
	let sentence: string = '' // 当前正在解析的句子

	// TODO 这里没找到对中文支持比较好的库，先自己简单通过标点符号分割句子
	const substrs = str.split(/[\.\?\!\;。？！；]+/)
	while (substrs.length > 0) {
		const s = substrs.shift()!
		if (s === '') {
			// 出现连续的标点，或者标点在头尾，将标点追加到当前句子中
			if (str !== '') {
				sentence = sentence + str.substring(0, 1)
				str = str.substring(1)
			}
		} else {
			// 开始新的句子
			const startAt = str.indexOf(s) // 找到新句子的起始位置
			if (startAt > 0) {
				// 新句子开始之前的标点，追加到前一个句子
				sentence = sentence + str.substring(0, startAt)
				str = str.substring(startAt)
			}
			// 前一个句子已经解析完整
			if (sentence !== '') {
				sentences.push(sentence)
			}
			// 设置当前解析的是新句子
			sentence = s
			str = str.substring(s.length)
		}
	}
	// 最后一个句子可能没结束，先记录
	if (sentence !== '') {
		sentences.push(sentence)
	}
	return sentences
}