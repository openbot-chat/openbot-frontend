import { z } from 'zod';
import { OrganizationRole } from './organization';

export const organizationInvitationSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.nativeEnum(OrganizationRole),
  organization_id: z.string(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()).optional(),
});


export type OrganizationInvitation = z.infer<typeof organizationInvitationSchema>;