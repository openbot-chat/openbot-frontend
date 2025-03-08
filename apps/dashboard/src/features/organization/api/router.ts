import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc-server'
import { organizationSchema, createOrganizationSchema, updateOrganizationSchema, pageSchemaFactory, OrganizationRole, organizationInvitationSchema } from 'models'
import { client } from '@/server/api/openbot-js'
import { TRPCError } from '@trpc/server'



export const orgRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      return client.orgs().get(id)
    }), 
  create: protectedProcedure
    .input(createOrganizationSchema)
    // .output(orgSchema)
    .mutation(async ({ ctx, input: org }) => {
      const createdOrg = await client.orgs().create(org)
      await client.orgs().addMembers(createdOrg.id, {
        members: [
          {
            role: OrganizationRole.ADMIN,
            user_id: ctx.session.user.id,  
          }
        ]
      });

      return org;
    }),
  update: protectedProcedure
    .input(updateOrganizationSchema)
    // .output(orgSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await client.orgs().update(id, data);
    }),
  list: protectedProcedure
    .input(z.object({
      size: z.number().gt(1).lte(100).nullish(),
      cursor: z.string().nullish(),
    }).nullish())
    // .output(z.array(organizationSchema))
    .query(async ({ ctx, input }) => {
      return await client.users(ctx).listOrgs(ctx.session.user.id, input)
    }),
  listMembers: protectedProcedure
    .input(z.object({
      orgId: z.string(),
      size: z.number().gt(1).lte(100).nullish(),
      cursor: z.string().nullish(),
    }).nullish())
    .query(async ({ ctx, input }) => {
      const { orgId, ...rest } = input

      const member = await client.orgs().getMember(orgId, ctx.session.user.id)
      if (!member) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return await client.orgs().listMembers(orgId, rest);
    }),
  getMember: protectedProcedure
    .input(z.object({
      orgId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const { orgId } = input;
      return client.orgs().getMember(orgId, ctx.session.user.id);
    }),
  updateMember: protectedProcedure
    .input(z.object({
      orgId: z.string(),
      userId: z.string(),
      role: z.nativeEnum(OrganizationRole),
    }))
    // .output(orgSchema)
    .mutation(async ({ ctx, input }) => {
      const { orgId, userId, role } = input;
      const member = await client.orgs().getMember(orgId, ctx.session.user.id);
      if (!member || member.role !== OrganizationRole.ADMIN) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return await client.orgs(ctx).updateMember(orgId, userId, {
        role,
      });
    }),
  deleteMember: protectedProcedure
    .input(z.object({
      orgId: z.string(),
      userId: z.string(),
    }))
    // .output(orgSchema)
    .mutation(async ({ ctx, input: { orgId, userId } }) => {
      const member = await client.orgs().getMember(orgId, ctx.session.user.id);
      if (!member || member.role !== OrganizationRole.ADMIN) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return await client.orgs(ctx).removeMembers(orgId, [userId]);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      return await client.orgs(ctx).delete(id);
    }),
  listInvitations: protectedProcedure
    .input(z.object({
      orgId: z.string(),
      size: z.number().gt(1).lte(100).nullish(),
      cursor: z.string().nullish(),
    }).nullish())
    .output(pageSchemaFactory(organizationInvitationSchema))
    .query(async ({ ctx, input }) => {
      const filter = {
        ...input,
        user_id: ctx.session.user.id,
      }

      // return await client.orgs().listMembers(ctx.session.orgId, filter);
      return {}
    }),
  updateInvitation: protectedProcedure
    .input(z.object({
      orgId: z.string(),
      invitationId: z.string(),
      role: z.nativeEnum(OrganizationRole),
    }))
    .mutation(async ({ ctx, input }) => {
      const { orgId, invitationId, role } = input;
      const member = await client.orgs().getMember(orgId, ctx.session.user.id);
      if (!member || member.role !== OrganizationRole.ADMIN) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return await client.orgs(ctx).updateInvitation(orgId, invitationId, {
        role,
      });
    }),
  deleteInvitation: protectedProcedure
    .input(z.object({
      orgId: z.string(),
      invitationId: z.string(),
    }))
    .mutation(async ({ ctx, input: { orgId, invitationId } }) => {
      const member = await client.orgs().getMember(orgId, ctx.session.user.id);
      if (!member || member.role !== OrganizationRole.ADMIN) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return await client.orgs(ctx).removeInvitations(orgId, [invitationId]);
    }),
  
});
