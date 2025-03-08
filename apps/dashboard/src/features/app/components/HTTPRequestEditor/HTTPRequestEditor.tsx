import { CodeIcon } from "@/components/icons"
import { HamburgerIcon } from "@chakra-ui/icons"
import { Button, Stack } from "@chakra-ui/react"
import { forwardRef, useImperativeHandle } from "react"
import { HTTPRequestEditorProvider, Header, BodyItem, Param, useHTTPRequestEditor } from "./context"
import { HTTPRequestCodeEditor } from "./HTTPRequestCodeEditor"
import { HTTPRequestFormEditor } from "./HTTPRequestFormEditor"



export interface HTTPRequestEditorRef {
  // editor?: HTMLDivElement | null
  state?: unknown
}


export type HTTPRequestEditorProps = {
  defaultMethod?: string
  method?: string
  codeTemplate?: string
  headers?: Header[]
  params?: Param[]
  body?: BodyItem[]
  url?: string
}


export const HTTPRequestEditor = forwardRef((props: HTTPRequestEditorProps, ref) => {
  return (
    <HTTPRequestEditorProvider {...props}>
      <HTTPRequestEditorInner ref={ref} {...props} />
    </HTTPRequestEditorProvider>
  )
})

HTTPRequestEditor.displayName = 'HTTPRequestEditor'



const HTTPRequestEditorInner = forwardRef(({
  codeTemplate,
}: HTTPRequestEditorProps, ref) => {
  const {
    mode, 
    setMode,
    params,
    headers,
    body,
    url,
    method,
    code,
  } = useHTTPRequestEditor()

  useImperativeHandle(ref, () => ({
    state: {
      mode,
      params,
      headers,
      body,
      url,
      method,
      code,
    }
  }))

  return (
    <Stack border="1px solid #ddd" borderRadius={2}>
      <Stack p={4}>
        {
          mode === 'form' ? (
            <HTTPRequestFormEditor/>
          ) : <HTTPRequestCodeEditor template={codeTemplate} />
        }
      </Stack>
      {
        mode === 'form' ? (
          <Button 
            w="full"
            leftIcon={<HamburgerIcon />}
            borderRadius={0}
            justifyContent="flex-start"
            onClick={() => setMode('code')}
          >
            Switch to Code Mode
          </Button>
        ) : (
          <Button 
            w="full"
            leftIcon={<CodeIcon />}
            borderRadius={0}
            justifyContent="flex-start"
            onClick={() => setMode('form')}
          >
            Switch to Form Mode
          </Button>
        )
      }
    </Stack>
  )
})

HTTPRequestEditorInner.displayName = 'HTTPRequestEditorInner'
