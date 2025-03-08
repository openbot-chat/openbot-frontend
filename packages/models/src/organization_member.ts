import { z } from 'zod';

export const organizationMemberSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  organization_id: z.string(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
});


export type OrganizationMember = z.infer<typeof organizationMemberSchema>;