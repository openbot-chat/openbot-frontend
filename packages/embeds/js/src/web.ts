import { registerWebComponents } from './register'
import { parseAgent, injectAgentInWindow } from './window'

registerWebComponents()

const agent = parseAgent()

injectAgentInWindow(agent)

// 设置默认 theme version
window.document.documentElement.style.setProperty("--str-chat__theme-version", "2")

export default agent
