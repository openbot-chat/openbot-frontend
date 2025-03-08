import axios from 'axios'
import qs from 'qs';

function resolveQuery(query) {
  /*const q = {
    ...(query.filter ?? {}),
    ...(query.pagination ?? {}),
  }*/
  return qs.stringify(query, { arrayFormat: 'repeat' })
}

export class OpenbotClient {  
  private opts

  constructor(opts = {}) {
    const defaults = { 
      baseUrl: 'http://127.0.0.1:5005/admin/v1',
    }
    this.opts = { ...defaults, ...opts }
  }

  async sendRequest(ctx, method: string, endpoint: string, data = null, params = null, stream = false) {
    let headers = {
      // 'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'x-gateway-api-key': this.opts.gatewayApiKey,
    }

    if (ctx && ctx.headers) {
      headers = { ...headers, ...ctx.headers }
    }

    const url = `${this.opts.baseUrl}${endpoint}`
    let response
    if (!stream) {
      response = await axios({
        method,
        url,
        data,
        params,
        headers,
        responseType: stream ? 'stream' : 'json',
      })

      return response.data;
    } else {
      response = await fetch(url, {
        headers,
        method,
        body: JSON.stringify(data),
      })
      
      return await response.json();
    }
  }

  normalize(it) {
    if (!it || !it.id) return undefined;
    it.created_at = new Date(it.created_at);
    it.updated_at = new Date(it.updated_at);
    return it
  }

  orgs(ctx: Record<string, unknown> = {}) {
    return {
      create: async (data) => this.sendRequest(ctx, 'POST', '/orgs', data),
      update: async (id: string, data) => this.sendRequest(ctx, 'PATCH', `/orgs/${id}`, data),
      delete: async (id: string) => this.sendRequest(ctx, 'DELETE', `/orgs/${id}`),
      get: async (id: string) => this.sendRequest(ctx, 'GET', `/orgs/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/orgs?${resolveQuery(query)}`),
      listMembers: async(orgId: string, query) => this.sendRequest(ctx, 'GET', `/orgs/${orgId}/members?${resolveQuery(query)}`),
      addMembers: async (orgId: string, data) => this.sendRequest(ctx, 'POST', `/orgs/${orgId}/members`, data),
      removeMembers: async (orgId: string, ids) => this.sendRequest(ctx, 'DELETE', `/orgs/${orgId}/members`, ids),
      getMember: async (orgId: string, userId: string) => this.sendRequest(ctx, 'GET', `/orgs/${orgId}/members/${userId}`),
      updateMember: async (orgId: string, userId: string, data) => this.sendRequest(ctx, 'PATCH', `/orgs/${orgId}/members/${userId}`, data),
      listInvitations: async(orgId: string, query) => this.sendRequest(ctx, 'GET', `/orgs/${orgId}/invitations?${resolveQuery(query)}`),
      updateInvitation: async (orgId: string, id: string, data) => this.sendRequest(ctx, 'PATCH', `/orgs/${orgId}/invitations/${id}`, data),
      removeInvitations: async (orgId: string, ids) => this.sendRequest(ctx, 'DELETE', `/orgs/${orgId}/invitations`, ids),
    }
  }

  users(ctx: Record<string, unknown> = {}) {
    return {
      get: async (id: string) => this.sendRequest(ctx, 'GET', `/users/${id}`),
      create: async (user) => this.sendRequest(ctx, 'POST', '/users', user),
      update: async (id: string, data) => this.sendRequest(ctx, 'PATCH', `/users/${id}`, data),
      listOrgs: async(id: string, query) => this.sendRequest(ctx, 'GET', `/users/${id}/orgs?${resolveQuery(query)}`),
      getUserByAccount: async ({ provider, providerAccountId }) => this.sendRequest(ctx, 'GET', `/users/by-provider/${provider}/account_id/${providerAccountId}`),
      getUserByEmail: async (email) => this.sendRequest(ctx, 'GET', `/users/by-email/${email}`),
    }
  }

  apikeys(ctx: Record<string, unknown> = {}) {
    return {
      create: async (data) => this.sendRequest(ctx, 'POST', '/apikeys', data),
      update: async (id: string, data) => this.sendRequest(ctx, 'PATCH', `/apikeys/${id}`, data),
      delete: async (id: string) => this.sendRequest(ctx, 'DELETE', `/apikeys/${id}`),
      get: async (id: string) => this.sendRequest(ctx, 'GET', `/apikeys/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/apikeys?${resolveQuery(query)}`),
    }
  }

  prompts(ctx: Record<string, unknown> = {}) {
    return {
      create: async (data) => this.sendRequest(ctx, 'POST', '/prompts', data),
      update: async (id: string, data) => this.sendRequest(ctx, 'PATCH', `/prompts/${id}`, data),
      delete: async (id: string) => this.sendRequest(ctx, 'DELETE', `/prompts/${id}`),
      get: async (id: string) => this.sendRequest(ctx, 'GET', `/prompts/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/prompts?${resolveQuery(query)}`),
    }
  }

  customPlans(ctx: Record<string, unknown> = {}) {
    return {
      findByOrgId: async(org_id) => this.sendRequest(ctx, 'GET', `/custom-plans/by-org_id/${org_id}`),
      findByExternalId: async(external_id) => this.sendRequest(ctx, 'GET', `/custom-plans/external/${external_id}`),
      get: async(id) => this.sendRequest(ctx, 'GET', `/custom-plans/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/custom-plans`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/custom-plans/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/custom-plans/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/custom-plans?${resolveQuery(query)}`),
    }
  }

  datastores(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/datastores/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/datastores`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/datastores/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/datastores/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/datastores?${resolveQuery(query)}`),
      generateUploadLink: async (id, data) => this.sendRequest(ctx, 'POST', `/datastores/${id}/generate-upload-link`, data),
      query: async(id, data) => this.sendRequest(ctx, 'POST', `/datastores/${id}/query`, data),
    }
  }

  datasources(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/datasources/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/datasources`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/datasources/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/datasources/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/datasources?${resolveQuery(query)}`),
      bulkDelete: async(ids) => this.sendRequest(ctx, 'POST', `/datasources/bulk-delete`, { ids }),
      sync: async(id) => this.sendRequest(ctx, 'POST', `/datasources/${id}/sync`),
      listDocuments: async(id, query) => this.sendRequest(ctx, 'GET', `/datasources/${id}/documents?${resolveQuery(query)}`),
    }
  }

  documents(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/documents/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/documents`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/documents/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/documents/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/documents?${resolveQuery(query)}`),
      bulkDelete: async(ids) => this.sendRequest(ctx, 'POST', `/documents/bulk-delete`, { ids }),
    }
  }

  agents(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/agents/${id}`),
      create: async(agent) => this.sendRequest(ctx, 'POST', `/agents`, agent),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/agents/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/agents/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/agents?${resolveQuery(query)}`),
      listTools: async(agentId, query) => this.sendRequest(ctx, 'GET', `/agents/${agentId}/tools?${resolveQuery(query)}`),
      addTool: async(agentId, data) => this.sendRequest(ctx, 'POST', `/agents/${agentId}/tools`, data),
      updateTool: async(agentId, agentToolId, data) => this.sendRequest(ctx, 'PATCH', `/agents/${agentId}/tools/${agentToolId}`, data),
      removeTool: async(agentId: string, agentToolId: string) => this.sendRequest(ctx, 'DELETE', `/agents/${agentId}/tools/${agentToolId}`),
      bindDatastore: async(agentId: string, datastoreId: string) => this.sendRequest(ctx, 'POST', `/agents/${agentId}/datastores/${datastoreId}`),
      unbindDatastore: async(agentId: string, datastoreId: string) => this.sendRequest(ctx, 'DELETE', `/agents/${agentId}/datastores/${datastoreId}`),
      listTemplates: async(query) => this.sendRequest(ctx, 'GET', `/agents/templates?${resolveQuery(query)}`),
      byIdentifier: async(identifier) => this.sendRequest(ctx, 'GET', `/agents/by-identifier/${identifier}`),
    }
  }

  accounts(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/accounts/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/accounts`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/accounts/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/accounts/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/accounts?${resolveQuery(query)}`),
    }
  }

  plugins(ctx: Record<string, unknown> = {}) {
    return {
      load: async(data) => this.sendRequest(ctx, 'POST', `/integrations/ai-plugins/load`, data),
    };
  }

  voices(ctx: Record<string, unknown> = {}) {
    return {
      list: async(query) => this.sendRequest(ctx, 'GET', `/voices?${resolveQuery(query)}`),
    }
  }

  credentials(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/credentials/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/credentials`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/credentials/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/credentials/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/credentials?${resolveQuery(query)}`),
    }
  }

  integrations(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/integrations/${id}`),
      by_identifier: async(identifier) => this.sendRequest(ctx, 'GET', `/integrations/by-identifier/${identifier}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/integrations`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/integrations/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/integrations/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/integrations?${resolveQuery(query)}`),
    }
  }

  tools(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/tools/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/tools`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/tools/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/tools/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/tools?${resolveQuery(query)}`),
    }
  }

  toolkits(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/toolkits/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/toolkits`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/toolkits/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/toolkits/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/toolkits?${resolveQuery(query)}`),
    }
  }

  agentTools(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/agent-tools/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/agent-tools`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/agent-tools/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/agent-tools/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/agent-tools?${resolveQuery(query)}`),
    }
  }

  conversations(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/conversations/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/conversations`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/conversations/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/conversations/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/conversations?${resolveQuery(query)}`),
      queryMessages: async(conversation_id, query) => this.sendRequest(ctx, 'GET', `/conversations/${conversation_id}/messages?${resolveQuery(query)}`),
      renew: async(data) => this.sendRequest(ctx, 'POST', `/conversations/renew`, data),
    }
  }

  categories(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/categories/${id}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/categories`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/categories/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/categories/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/categories?${resolveQuery(query)}`),
    }
  }

  marketplace(ctx: Record<string, unknown> = {}) {
    return {
      listAgents: async(query) => this.sendRequest(ctx, 'GET', `/marketplace/agents?${resolveQuery(query)}`),
    }
  }

  subscriptions(ctx: Record<string, unknown> = {}) {
    return {
      getByOrganization: async(org_id: string) => this.sendRequest(ctx, 'GET', `/subscription?${resolveQuery({org_id})}`),
      getPortalUrlByOrganization: async(org_id: string) => this.sendRequest(ctx, 'GET', `/subscription/portal?${resolveQuery({org_id})}`),
      create: async (data: any) => this.sendRequest(ctx, 'POST', `/subscription/plans/${data.plan}/checkout?org_id=${data.org_id}`, data),
      update: async (data: any) => this.sendRequest(ctx, 'POST', `/subscription/upgrade?org_id=${data.org_id}`, data),
    }
  }

  plans() {
    return {
      list: async() => this.sendRequest({}, 'GET', `/subscription/plans`),
    } 
  }


  connections(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/connection-providers/${id}`),
      getByIdentifier: async(identifier: string) => this.sendRequest(ctx, 'GET', `/connection-providers/by-identifier/${identifier}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/connection-providers`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/connection-providers/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/connection-providers/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/connection-providers?${resolveQuery(query)}`),
    }
  }

  apps(ctx: Record<string, unknown> = {}) {
    return {
      get: async(id) => this.sendRequest(ctx, 'GET', `/apps/${id}`),
      getByIdentifier: async(identifier: string) => this.sendRequest(ctx, 'GET', `/apps/by-identifier/${identifier}`),
      create: async(data) => this.sendRequest(ctx, 'POST', `/apps`, data),
      update: async(id, data) => this.sendRequest(ctx, 'PATCH', `/apps/${id}`, data),
      delete: async(id) => this.sendRequest(ctx, 'DELETE', `/apps/${id}`),
      list: async(query) => this.sendRequest(ctx, 'GET', `/apps?${resolveQuery(query)}`),
    }
  }
}

export const client = new OpenbotClient({
  baseUrl: process.env.OPENBOT_API_GATEWAY_URL,
  gatewayApiKey: process.env.OPENBOT_GATEWAY_API_KEY,
});