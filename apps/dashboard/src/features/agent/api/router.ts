import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc-server'
import { 
  pageSchemaFactory, 
  agentSchema, 
  createAgentSchema, 
  updateAgentSchema,
  createAgentToolSchema,
  AgentVisibility,
} from 'models'
import { 
  client,
} from '@/server/api/openbot-js'
import { TRPCError } from '@trpc/server'


export const agentRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const agent = await client.agents().get(id)

      const member = await client.orgs().getMember(agent.org_id, ctx.session.user.id)
      if (!member) {
        if (agent.visibility === AgentVisibility.Public) {
          delete agent.options
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
      }

      return agent
    }),
  create: protectedProcedure
    .input(createAgentSchema)
    // .output(agentSchema)
    .mutation(async ({ ctx, input }) => {
      const member = await client.orgs().getMember(input.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const data = {
        ...input,
        creator_id: ctx.session.user.id,
      }

      return await client.agents().create(data)
    }),
  update: protectedProcedure
    .input(updateAgentSchema)
    // .output(agentSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const agent = await client.agents().get(id)
      if (!agent) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'agent not found' })

      const member = await client.orgs().getMember(agent.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agents().update(id, data)
    }),
  list: protectedProcedure
    .input(
      z.object({
        org_id: z.string(),
        size: z.number().gt(1).lte(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    // .output(pageSchemaFactory(agentSchema))
    .query(async ({ ctx, input }) => {
      const member = await client.orgs().getMember(input.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agents().list(input)
    }),
  listTools: protectedProcedure
    .input(z.object({
      id: z.string(),
      size: z.number().gt(1).lte(100).nullish(),
      cursor: z.string().nullish(),
    }))
    // .output(pageSchemaFactory(pluginSchema))
    .query(async ({ ctx, input }) => {
      const { id, ...data } = input

      const agent = await client.agents().get(id)
      if (!agent) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'agent not found' })

      const member = await client.orgs().getMember(agent.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agents().listTools(id, data);
    }),
  addTool: protectedProcedure
    .input(createAgentToolSchema)
    .mutation(async ({ ctx, input }) => {
      const { agent_id, ...data } = input

      const agent = await client.agents().get(agent_id)
      if (!agent) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'agent not found' })

      const member = await client.orgs().getMember(agent.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agents().addTool(agent_id, data);
    }),
  updateTool: protectedProcedure
    .input(
      z.object({
        agent_tool_id: z.string(),
        agent_id: z.string(),
        options: z.any().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        return_direct: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { agent_tool_id, agent_id, ...data } = input

      const agent = await client.agents().get(agent_id)
      if (!agent) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'agent not found' })

      const member = await client.orgs().getMember(agent.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agents(ctx).updateTool(agent_id, agent_tool_id, data)
    }),
  removeTool: protectedProcedure
    .input(z.object({
      agent_id: z.string(),
      agent_tool_id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { agent_id, agent_tool_id } = input

      const agent = await client.agents().get(agent_id)
      if (!agent) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'agent not found' })

      const member = await client.orgs().getMember(agent.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agents().removeTool(agent_id, agent_tool_id)
    }),
  bindDatastore: protectedProcedure
    .input(z.object({
      agentId: z.string(),
      datastoreId: z.string(),
    }))
    // .output(pageSchemaFactory(pluginSchema))
    .mutation(async ({ ctx, input }) => {
      const { agentId, datastoreId } = input

      const agent = await client.agents().get(agentId)
      if (!agent) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'agent not found' })

      const member1 = await client.orgs().getMember(agent.org_id, ctx.session.user.id)
      if (!member1) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const datastore = await client.datastores().get(datastoreId)
      if (!datastore) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'datastore not found' })

      const member2 = await client.orgs().getMember(datastore.org_id, ctx.session.user.id)
      if (!member2) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agents().bindDatastore(agentId, datastoreId)
    }),
  unbindDatastore: protectedProcedure
    .input(z.object({
      agentId: z.string(),
      datastoreId: z.string(),
    }))
    // .output(pageSchemaFactory(pluginSchema))
    .mutation(async ({ ctx, input }) => {
      const { agentId, datastoreId } = input

      const agent = await client.agents().get(agentId)
      if (!agent) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'agent not found' })

      const member1 = await client.orgs().getMember(agent.org_id, ctx.session.user.id)
      if (!member1) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const datastore = await client.datastores().get(datastoreId)
      if (!datastore) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'datastore not found' })

      const member2 = await client.orgs().getMember(datastore.org_id, ctx.session.user.id)
      if (!member2) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agents().unbindDatastore(agentId, datastoreId)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const agent = await client.agents().get(id)
      if (!agent) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'agent not found' })

      const member1 = await client.orgs().getMember(agent.org_id, ctx.session.user.id)
      if (!member1) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agents().delete(id)
    }),
  listTemplates: protectedProcedure
    .input(
      z.object({
        size: z.number().gt(1).lte(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .output(pageSchemaFactory(agentSchema))
    .query(async ({ ctx, input }) => {
      // const r = await client.agents().list(input);
      const now = new Date();
      const r = {
        items: [
          {
            id: "13dfa434-c10a-4efe-91aa-c6faae604b37",
            name: "Website Guide",
            instructions: "Online customer service, answering customer questions about the website",
            created_at: now,
            updated_at: now,
          },
          {
            id: "e1869da7-c88f-4cf4-b77e-31f4c08dcf92",
            name: "Reading Copilot",
            instructions: "Assist in collecting information, translating and summarizing it",
            created_at: now,
            updated_at: now,
          },
          /*{
            id: "3",
            name: "System Copilot",
            instructions: "Assist you in using the system and interoperate with it",
            created_at: now,
            updated_at: now,
          },
          {
            id: "4",
            name: "Shop Assistant",
            instructions: "Guide users to purchase products and services",
            created_at: now,
            updated_at: now, 
          },
          {
            id: "5",
            name: "Secretary",
            instructions: "Help you record and manage data, memory, and schedule",
            created_at: now,
            updated_at: now,
          },
          {
            id: "6",
            name: "Professional Service",
            instructions: "Professional Service for use Some Tools",
            created_at: now,
            updated_at: now,
          },
          {
            id: "7",
            name: "Teacher",
            instructions: "Develop a learning plan and gradually teach students",
            created_at: now,
            updated_at: now,
          }
          */
        ]
      }
      return r;
    }),
    identifierAvailable:  protectedProcedure
      .input(z.string())
      // .output(pageSchemaFactory(agentSchema))
      .query(async ({ input: identifier }) => {
        const agent = await client.agents().byIdentifier(identifier);
        return {
          isAvailable: !agent,
        };
      })
});
