import { Organization } from 'models'

export const parseNewName = (
  organizationName: string | undefined,
  existingOrganizations: Pick<Organization, 'name'>[]
) => {
  let newName = organizationName ?? 'My workspace'
  let i = 1
  while (existingOrganizations.find((w) => w.name === newName)) {
    newName = `${organizationName} (${i})`
    i++
  }
  return newName
}
