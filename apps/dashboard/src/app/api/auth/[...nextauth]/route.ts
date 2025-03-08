import { NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth'
// import EmailProvider from 'next-auth/providers/email'

import { nextAuthOptions } from '@/server/auth/options'


const mockedUser = {
  id: '123',
  name: 'mockUser',
}

const handler1 = async (req: NextRequest) => {
  console.log(`auth: ${req.url}`);

  if (
    req.method === 'GET' &&
    req.url === '/api/auth/session' &&
    process.env.E2E_TEST === 'true'
  ) {
    return NextResponse.json({ user: mockedUser });
  }

  if (req.method === 'HEAD') {    
    return new NextResponse("OK", { status: 200 });
  }

  const auth = NextAuth(nextAuthOptions)
  return await auth(req)
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }