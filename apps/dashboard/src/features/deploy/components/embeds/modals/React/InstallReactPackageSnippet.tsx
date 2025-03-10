import { CodeEditor } from '@/components/inputs/CodeEditor'

export const InstallReactPackageSnippet = () => {
  return (
    <CodeEditor
      value={`npm install @openbot/react`}
      isReadOnly
      lang="shell"
    />
  )
}
