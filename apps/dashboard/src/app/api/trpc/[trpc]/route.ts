import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { allRouter, createContext } from "@/server"
import { NextRequest } from 'next/server';
// import { log } from "next-axiom"
// import { withAxiom } from "next-axiom"

const handler = (req: NextRequest) => fetchRequestHandler({
  endpoint: '/api/trpc',
  router: allRouter,
  req,
  createContext,
  onError: ({ path, error }) => {
    console.error(`❌ tRPC failed on ${path}: ${error}`);
    /*
    log.error(error.message, {
      type,
      path,
      input,
      ctx,
      req,
    })
    */
  },
})

export { handler as GET, handler as POST }