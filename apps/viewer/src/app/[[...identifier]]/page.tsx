import { headers } from 'next/headers'
import { ErrorPage } from '@/components/ErrorPage'
import { NotFoundPage } from '@/components/NotFoundPage'
import { sendRequest } from '@openbot/lib'
import { AgentPage, AgentPageProps } from '@/components/AgentPage'
import { env } from '@openbot/env'

const log = (message: string) => {
	// if (process.env.DEBUG !== 'true') return
	console.log(`[DEBUG] ${message}`)
}

type HeaderList = ReturnType<typeof headers>

const apiHost = env.NEXT_PUBLIC_OPENBOT_WEB_API_BASE_URL ?? 'https://api.openbot.chat/web/v1'

// Browsers that doesn't support ES modules and/or web components
const incompatibleBrowsers = [
	{
		name: 'UC Browser',
		regex: /ucbrowser/i,
	},
	{
		name: 'Internet Explorer',
		regex: /msie|trident/i,
	},
	{
		name: 'Opera Mini',
		regex: /opera mini/i,
	},
]

const getIncompatibleBrowser = (headerList: HeaderList): string | null => {
	const userAgent = headerList.get('user-agent') ?? ''
    
  const incompatibleBrowser =
		incompatibleBrowsers.find((browser) =>
			browser.regex.test(userAgent)
		)?.name ?? null
	return incompatibleBrowser
}

const getHost = (headerList?: HeaderList): { host?: string; forwardedHost?: string } => ({
	host: headerList ? headerList.get('host') as string : window.location.host,
	forwardedHost: headerList?.get('x-forwarded-host') as string | undefined,
})

const getAgent = async (
	headerList: HeaderList,
	pathname: string,
	identifier?: string
): Promise<AgentPageProps['agent'] | null> => {
	const { host, forwardedHost } = getHost(headerList)
	log(`identifier: ${identifier}`)
	log(`host: ${host}, forwardedHost: ${forwardedHost}`)
	try {
		if (!host) return null
    const viewerUrls = env.NEXT_PUBLIC_VIEWER_URL
		log(`viewerUrls: ${viewerUrls}`)
		const isMatchingViewerUrl =
      env.NEXT_PUBLIC_E2E_TEST
				? true
				: viewerUrls.some(
					(url) =>
						host.split(':')[0].includes(url.split('//')[1].split(':')[0]) ||
						(forwardedHost &&
							forwardedHost
								.split(':')[0]
								.includes(url.split('//')[1].split(':')[0]))
				)
		log(`isMatchingViewerUrl: ${isMatchingViewerUrl}`)
		const customDomain = `${forwardedHost ?? host}${pathname === '/' ? '' : pathname
			}`
		const agent = isMatchingViewerUrl
			? await getAgentFromIdentifier(identifier)
			: await getAgentFromCustomDomain(customDomain)
		return agent
	} catch (err) {
		console.error('what: ', err)
	}
	return null
}

const getAgentFromIdentifier = async (
	identifier?: string | string[]
): Promise<AgentPageProps['agent'] | null> => {
	if (!identifier) return null
	identifier = typeof identifier === 'string' ? identifier : identifier[0]
	

  console.warn('apiHost: ', `${apiHost}/agents/by-identifier/${identifier}`)
  const resp = await sendRequest<AgentPageProps['agent']>({
		method: 'GET',
		url: `${apiHost}/agents/by-identifier/${identifier}`
	})
	if (resp.error) {
    console.error('resp.error: ', resp.error)
		throw resp.error
	}
	return resp.data ?? null
}

// TODO
const getAgentFromCustomDomain = async (
	_customDomain: string
): Promise<AgentPageProps['agent'] | null> => {
	return null
}

type Props = {
	params: { identifier?: string[] }
	searchParams: { [key: string]: string | string[] | undefined }
}

const Page = async ({
	params,
	searchParams,
}: Props) => {
	let identifier = params.identifier || searchParams.identifier
	identifier = typeof identifier === 'string' ? identifier : (identifier ? identifier[0] : identifier)
	const pathname = (params.identifier ?? []).join('/')
	const headersList = headers()
	const incompatibleBrowser = getIncompatibleBrowser(headersList)
	const agent = await getAgent(headersList, pathname, identifier)

	if (incompatibleBrowser)
		return (
			<ErrorPage
				error={
					new Error(
						`Your web browser: ${incompatibleBrowser}, is not supported.`
					)
				}
			/>
		)


	if (!agent)
		return <NotFoundPage />

	// if (publishedAgent.agent.isClosed)
	//   return <ErrorPage error={new Error('This bot is now closed')} />

	return <AgentPage agent={agent} />
}

export default Page


// TODO html metadata