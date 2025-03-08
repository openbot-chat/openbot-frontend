import { guessApiHost } from '../utils/guessApiHost'
import { isNotEmpty, sendRequest } from '@openbot/lib'
import { Agent } from 'src/types'

export type SayParams = {
	apiHost?: string
	text: string
	agent: Agent
}

export type SayResponse = {
	format: string
	data?: string
	url?: string
}

export async function say({
	apiHost,
	text,
	agent,
}: SayParams): Promise<SayResponse> {

	const resp = await sendRequest<SayResponse>({
		method: 'POST',
		url: `${isNotEmpty(apiHost) ? apiHost : guessApiHost()}/agents/${agent.id}/voices/say`,
		body: {
			text,
		},
	})

	if (resp.error) {
		throw resp.error
	}
	return resp.data!
}
