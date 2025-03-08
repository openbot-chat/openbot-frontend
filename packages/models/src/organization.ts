import { z } from 'zod'
import { PlanEnum } from './plan'

export enum OrganizationRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}


export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  plan: z.nativeEnum(PlanEnum),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
});

export const createOrganizationSchema = organizationSchema.pick({
  name: true,
  icon: true,
}).partial();

export const updateOrganizationSchema = organizationSchema.omit({
  created_at: true,
  updated_at: true,
}).partial();


export type Organization = z.infer<typeof organizationSchema>;