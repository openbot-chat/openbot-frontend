// import { getServerSession } from "next-auth/next";
import PromptsClientPage from "./client-page"
import { nextAuthOptions } from "@/server/auth/options"
import { client } from '@/server/api/openbot-js'
import { getServerSession } from "next-auth"


export const metadata = {
  title: "Prompts | Openbot",
  description: "Manage your prompts",
}

export default async function PromptList() {
  const session = await getServerSession(nextAuthOptions)
  // const api = new Api(session)

  const promptData = await client.prompts({ session }).list({})

  return <PromptsClientPage data={promptData.items} />
}