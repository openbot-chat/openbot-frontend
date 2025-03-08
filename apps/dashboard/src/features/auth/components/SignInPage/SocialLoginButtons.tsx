import { signIn } from 'next-auth/react'
import React from 'react'

import {
  VStack,
  Button,
} from '@chakra-ui/react'
import {
  GithubLogo,
  WechatIcon,
} from '@/components/icons'
import { LoginButton as TelegramLoginButton } from '@telegram-auth/react'
import { FaFacebook, FaTwitter } from 'react-icons/fa'
import { DiscordLogo } from '@/assets/icons/DiscordLogo'
import { GoogleLogo } from '@/assets/icons/GoogleLogo'
import { useTranslations } from 'next-intl'

export type SocialLoginButtonsProps = {
  callbackUrl: string
  providers: any[]
}

const icons = {
  github: GithubLogo,
  google: GoogleLogo,
  twitter: FaTwitter,
  facebook: FaFacebook,
  discord: DiscordLogo,
  'wechat:pc': WechatIcon,
}

const colorSchemes = {
  facebook: 'facebook',
  twitter: 'twitter',
  discord: 'discord',
}


export default function SocialLoginButtons({ callbackUrl, providers }) {
  const scopedT = useTranslations('login')
  
  const handleSocialLogin = (provider) => {
    // 内部进行了 CSRF 防护，先请求一个 CSRF token 再连同表单一起提交
    signIn(provider.id, 
      {
        callbackUrl,
      }, {
      }
    )
  }

  const renderIcon = (id: string) => {
    const Icon = icons[id]
    return Icon ? <Icon /> : <></>
  }


  const socialProviders = Object.values(providers || []).filter((it) => it.id !== 'sms' && it.id !== 'email')
  return <>
    <VStack w='full' spacing={2}>
      {socialProviders.map((provider) => (
        <React.Fragment key={provider.id}>
          {provider.id === 'telegram' ? (
            <TelegramLoginButton
              className="w-full"
              width="100%"
              style={{
                width: "100%",
              }}
              botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}
              onAuthCallback={(data) => {
                signIn(provider.id, { callbackUrl }, data as any)
              }}
            />
          ) : provider.id === 'google' ? (
            <Button 
              key={provider.id} 
              rounded="full"
              leftIcon={renderIcon(provider.id)} 
              w="full" 
              size="lg" 
              onClick={() => handleSocialLogin(provider)}
              bg="#FFFFFF"
              _hover={{
                backgroundColor: '#FFFFFF',
              }}
              _active={{
                backgroundColor: '#FFFFFF',
              }}
              _focus={{
                backgroundColor: '#FFFFFF',
              }}
              color="gray.900"
              variant="outline"
            >
              {scopedT.rich('signInButton.label', {
                provider: () => provider.name,
              })}
            </Button>
          ) : (
            <Button 
              rounded="full"
              key={provider.id}
              leftIcon={renderIcon(provider.id)}
              w="full"
              size="lg"
              onClick={() => handleSocialLogin(provider)}
              colorScheme={colorSchemes[provider.id]}
            >
              {provider.name}
            </Button>
          )}
        </React.Fragment>
      ))}
    </VStack>
  </>
}