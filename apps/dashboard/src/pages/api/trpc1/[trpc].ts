import { createNextApiHandler } from "@trpc/server/adapters/next";
import { allRouter, createContext } from "../../../server";
// import { log } from "next-axiom"
// import { withAxiom } from "next-axiom"

export default createNextApiHandler({
  router: allRouter,
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
});
