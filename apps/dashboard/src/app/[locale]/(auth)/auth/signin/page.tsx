import SignInPage from '@/features/auth/components/SignInPage'
import { nextAuthOptions } from '@/server/auth/options'

type Props = {
  searchParams: { callbackUrl: string }
}

export default async function Page({
  searchParams: {
    callbackUrl,
  }
}: Props) {
  const providers = nextAuthOptions.providers.map(it => ({
    id: it.options?.id ?? it.id,
    name: it.options?.name ?? it.name,
  }));

  return <SignInPage providers={providers} callbackUrl={callbackUrl} />
}