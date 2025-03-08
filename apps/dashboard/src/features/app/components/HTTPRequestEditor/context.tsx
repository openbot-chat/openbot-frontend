import { useEffect, useState, createContext, ReactNode, useContext, useMemo } from "react";








function useArray<T>(defaultItems?: T[]) {
  const [items, setItems] = useState<T[]>(defaultItems ?? [])

  const addItem = (item: T, index = -1) => {
    const newItems = [...items]
    if(0 <= index && 0 <= items.length - 1) {
      newItems.splice(index + 1, 0, item)
    } else {
      newItems.push(item)
    }

    setItems(newItems)
  }

  const deleteItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1);
    setItems(newItems)
  }

  const setItem = (item: T, index: number) => {
    const newItems = [...items]
    newItems[index] = item
    setItems(newItems)
  }

  return {
    items,
    setItem,
    addItem,
    deleteItem,
    setItems,
  }
}


export type Param = { key: string; value: string }
export type Header = { key: string; value: string }
export type BodyItem = { key: string; value: string }

type HTTPRequestEditorContextValue = {
  mode: string
  setMode: (v: string) => void
  params?: Param[]
  addParam: (param: Param, index?: number) => void
  setParam: (param: Param, index: number) => void
  deleteParam: (index: number) => void
  headers?: Header[]
  addHeader: (param: Header, index?: number) => void
  setHeader: (param: Header, index: number) => void
  deleteHeader: (index: number) => void
  method: string
  setMethod: (v: string) => void
  url?: string
  setUrl: (v: string) => void
  body?: BodyItem[]
  addBodyItem: (param: BodyItem, index?: number) => void
  setBodyItem: (param: BodyItem, index: number) => void
  deleteBodyItem: (index: number) => void
  code?: string
  setCode: (v: string) => void
}

const HTTPRequestEditorContext = createContext<HTTPRequestEditorContextValue>({
  mode: 'form',
  method: "GET",
})



type HTTPRequestEditorProviderProps = {
  children: ReactNode
  defaultMethod?: string
} & Partial<HTTPRequestEditorContextValue>

export const HTTPRequestEditorProvider: React.FC<HTTPRequestEditorProviderProps> = ({
  children,
  mode: propMode = 'form',
  defaultMethod = 'GET',
  method: propMethod,
  url: propUrl,
  body: propBody,
  headers: propHeaders,
  params: propParams,
  code: propCode,
}) => {
  const {
    items: params,
    addItem: addParam,
    setItem: setParam,
    deleteItem: deleteParam,
  } = useArray<Param>((!!propParams && propParams.length > 0) ? propParams : [{ key: '', value: ''}])

  const {
    items: headers,
    addItem: addHeader,
    setItem: setHeader,
    deleteItem: deleteHeader,
  } = useArray<Header>((!!propHeaders && propHeaders.length > 0) ? propHeaders : [{ key: '', value: ''}])

  const {
    items: body,
    addItem: addBodyItem,
    setItem: setBodyItem,
    deleteItem: deleteBodyItem,
  } = useArray<BodyItem>((!!propBody && propBody.length > 0) ? propBody : [{ key: '', value: ''}])

  const [method, setMethod] = useState(propMethod ?? defaultMethod)
  const [url, setUrl] = useState(propUrl)
  const [code, setCode] = useState(propCode)
  const [mode, setMode] = useState(propMode)

  /*
  useEffect(() => {
    setParams(propParams)
  }, [propParams, setParams])
  useEffect(() => {
    setHeaders(propHeaders)
  }, [propHeaders, setHeaders])
  useEffect(() => {
    setBody(propBody)
  }, [propBody, setBody])
  */
  useEffect(() => {
    setMethod(propMethod)
  }, [propMethod])
  useEffect(() => {
    setUrl(propUrl)
  }, [propUrl])
  useEffect(() => {
    setCode(propCode)
  }, [propCode])
  useEffect(() => {
    setMode(propMode)
  }, [propMode])

  const value = useMemo(() => ({
    params,
    addParam,
    setParam,
    deleteParam,
    headers,
    addHeader,
    setHeader,
    deleteHeader,
    body,
    addBodyItem,
    setBodyItem,
    deleteBodyItem,
    method,
    setMethod,
    url,
    setUrl,
    code,
    setCode,
    mode,
    setMode,
  }), [
    params,
    addParam,
    setParam,
    deleteParam,
    headers,
    addHeader,
    setHeader,
    deleteHeader,
    body,
    addBodyItem,
    setBodyItem,
    deleteBodyItem,
    method,
    setMethod,
    url,
    setUrl,
    code,
    setCode,
    mode,
    setMode,
  ])

  return (
    <HTTPRequestEditorContext.Provider value={value}>
      {children}
    </HTTPRequestEditorContext.Provider>
  )
}

export const useHTTPRequestEditor = () => useContext(HTTPRequestEditorContext)