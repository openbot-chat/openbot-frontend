import { CodeEditor } from "@/components/inputs/CodeEditor"
import { useMemo } from "react"
import { useHTTPRequestEditor } from "./context"
import { useLiquid } from 'react-liquid'


const defaultRequestTemplate = `const options = {
  url: '{{url}}',
  method: '{{method}}',
  headers: {
    {% for item in headers %}{% if item.key != '' %}'{{ item.key }}' : '{{ item.value }}',{% endif %}
    {% endfor %}
  },
  params: {
    {% for item in params %}{% if item.key != '' %}'{{ item.key }}' : '{{ item.value }}',{% endif %}
    {% endfor %}
  },
  body: {
    {% for item in body %}{% if item.key != '' %}'{{ item.key }}' : '{{ item.value }}',{% endif %}
    {% endfor %}
  }
}

return z.request(options)
  .then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });`





type HTTPRequestCodeEditorProps = {
  template?: string
}

export const HTTPRequestCodeEditor = ({
  template = defaultRequestTemplate,
}: HTTPRequestCodeEditorProps) => {
  const {
    url,
    params,
    headers,
    body,
    code,
    setCode,
  } = useHTTPRequestEditor()

  const { status, markup } = useLiquid(template, {
    url,
    params,
    headers,
    body,
  })
  
  return (
    <>
      {(status === "rendering" || !markup) ? undefined : (
        <CodeEditor 
          lang="javascript" 
          height="360px"
          value={code ?? markup}
          onChange={setCode}
        />
      )}
    </>
    
  )
}