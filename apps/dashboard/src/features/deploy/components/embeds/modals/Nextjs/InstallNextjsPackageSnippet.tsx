import { CodeEditor } from '@/components/inputs/CodeEditor'

export const InstallNextjsPackageSnippet = () => {
  return (
    <CodeEditor
      value={`npm install @openbot/nextjs`}
      isReadOnly
      lang="shell"
    />
  )
}
