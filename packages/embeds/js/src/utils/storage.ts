const sessionStorageKey = 'conversationId'

export const getExistingConversationIdFromStorage = (agentId?: string) => {
  if (!agentId) return
  try {
    return (
      sessionStorage.getItem(`${sessionStorageKey}-${agentId}`) ??
      localStorage.getItem(`${sessionStorageKey}-${agentId}`) ??
      undefined
    )
  } catch {
    /* empty */
  }
}

export const setConversationInStorage =
  (storageType: 'local' | 'session' = 'session') =>
    (agentId: string, conversationId: string) => {
      try {
        (storageType === 'session' ? localStorage : sessionStorage).removeItem(
          `${sessionStorageKey}-${agentId}`
        )
        return (
          storageType === 'session' ? sessionStorage : localStorage
        ).setItem(`${sessionStorageKey}-${agentId}`, conversationId)
      } catch {
        /* empty */
      }
    }
