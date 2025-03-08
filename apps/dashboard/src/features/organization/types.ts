import { OrganizationMember } from 'models'

export type Member = OrganizationMember & {
  name: string | null
  image: string | null
  email: string | null
}
