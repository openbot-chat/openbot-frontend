"use client"
import { useCallback, useEffect, useMemo } from "react";
import SignInForm from "./SignInForm";
import SocialLoginButtons from "./SocialLoginButtons";
import {
  useToast,
  Card,
  CardHeader,
  CardBody,
  Center,
  VStack,
  Heading,
  HStack,
  SlideFade,
} from '@chakra-ui/react';

import {
  signIn,
  useSession,
} from 'next-auth/react'
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from 'next-intl';

import { Logo } from '@/assets/icons/Logo';

type Props = {
  providers: any[];
  callbackUrl?: string;
}

export default function SignInPage({ 
  providers, 
  callbackUrl: _callbackUrl,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { status } = useSession();
  const toast = useToast();

  const searchParams = useSearchParams();

  const callbackUrl = useMemo(() => _callbackUrl ?? searchParams?.get('callbackUrl') ?? '/', [_callbackUrl, searchParams]);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(`/`)
    }
  }, [status, router])

  const handleSendVCode = useCallback(async ({ phone_number, country_code }) => {
    console.log('发送验证码');
    
    const result = await fetch(`/api/auth/2fa/send_sms`, {
      method: "POST",
      body: JSON.stringify({ phone_number, country_code }),
      headers: { "Content-Type": "application/json" },
    });

    if (!result.ok) {
      toast({
        status: 'error',
        description: '验证码发送失败',
      })
    } else {
      toast({
        description: '验证码发送成功', 
      })
    }
  }, []);

  const handleSignIn = useCallback(async (data) => {
    console.log('登录');

    // 内部进行了 CSRF 防护，先请求一个 CSRF token 再连同表单一起提交
    const response = await signIn('sms', {
      ...data, 
      callbackUrl,
    });
    
    response?.error
      ? toast({      
          status: 'error',
          title: 'Unauthorized',
          description: 'Sign ups are disabled.',
        }
      ) : 
      toast({
        title: 'Success!',
        description: 'Check your inbox to sign in',
      })

  }, []);

  return (
    <Center w="full" h="full">
      <SlideFade in={true} offsetY='100px'>
        <Card w="540px" maxW="md">
          <CardHeader as={HStack}>
            <Logo boxSize="36px" />
            <Heading>
              {t('login.title')}
            </Heading>
          </CardHeader>
          <CardBody as={VStack} spacing={4}>
            {false &&<SignInForm 
              onSendVCode={handleSendVCode} 
              onSignIn={handleSignIn}
            />}
            <SocialLoginButtons providers={providers} callbackUrl={callbackUrl}/>
          </CardBody>
        </Card>
      </SlideFade>
    </Center>
  );
}