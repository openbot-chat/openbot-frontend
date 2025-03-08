import Head from 'next/head'
import { getBaseUrl } from '@/utils/utils'

export const Seo = ({
  title,
  currentUrl = getBaseUrl(),
  description = '新型社会化客户关系管理系统',
  imagePreviewUrl = 'https://app.openbot.chat/site-preview.png',
}: {
  title: string
  description?: string
  currentUrl?: string
  imagePreviewUrl?: string
}) => {
  const formattedTitle = `${title} | GrowingCRM`

  return (
    <Head>
      <title>{formattedTitle}</title>
      <meta name="title" content={title} />
      <meta property="og:title" content={title} />
      <meta property="twitter:title" content={title} />

      <meta property="twitter:url" content={currentUrl} />
      <meta property="og:url" content={currentUrl} />

      <meta name="description" content={description} />
      <meta property="twitter:description" content={description} />
      <meta property="og:description" content={description} />

      <meta property="og:image" content={imagePreviewUrl} />
      <meta property="twitter:image" content={imagePreviewUrl} />

      <meta property="og:type" content="website" />
      <meta property="twitter:card" content="summary_large_image" />
    </Head>
  )
}
