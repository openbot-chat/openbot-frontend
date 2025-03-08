


export type XRequest = {
  url: string
  method: string
  params: Record<string, any>
  headers: Record<string, any>
  body: Record<string, any>
}



export const makeRequest = async (
  request: XRequest
) => {
  const {
    url: baseUrl,
    method,
    params,
    headers,
    body,
  } = request

  const url = new URL(baseUrl)
  url.search = new URLSearchParams(params).toString()

  console.warn('url.search: ', url.search)

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: JSON.stringify(body),
  })

  return await response.json()
}