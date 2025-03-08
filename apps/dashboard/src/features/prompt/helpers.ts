export const getPromptVariables = (s: string) => {
  const variables = []
  const regex = /{(.*?)}/g;
  let match

  while ((match = regex.exec(s))) {
    const variable = match[1].trim()
    if (variable.length > 0) variables.push(variable)
  }

  const uniqueVariables = [...new Set(variables)]
  return uniqueVariables
}