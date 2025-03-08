'use client'
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { usePathname, useRouter } from '@/navigation'


type Props = {
  children: React.ReactNode;
}


export const AuthController = ({
  children,
}: Props) => {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      if (pathname !== '/auth/signin') {
        router.replace('/auth/signin')
      }
    }
  }, [pathname, session, router])

  console.log('session.status: ', session.status, pathname)

  // return (session.status === 'authenticated' || pathname === '/auth/signin') && children;
  return (!!session.data || pathname === '/auth/signin') && children;
}