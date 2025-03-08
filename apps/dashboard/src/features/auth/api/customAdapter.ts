import type { Adapter, AdapterUser } from 'next-auth/adapters'

import { OpenbotClient } from '@/server/api/openbot-js';
import { OrganizationRole, PlanEnum } from 'models';


export function customAdapter(client: OpenbotClient): Adapter {
  return {
    createUser: async (data: Omit<AdapterUser, 'id'>) => {
      console.log('createUser: ', data)
      
      const org = await client.orgs().create({
        name: 'My Workspace',
        plan: PlanEnum.FREE,
      })

      const createdUser = await client.users().create({
        name: data.name,
        email: data.email,
        avatar: data.image,
      })

      await client.orgs().addMembers(org.id, {
        members: [{
          role: OrganizationRole.ADMIN,
          user_id: createdUser.id,
        }]
      })

      console.log('createdUser: ', createdUser)

      return {
        id: createdUser.id,
        ...data,
      }
    },
    getUser: async (id: string) => {
      console.warn('adapter getUser: ', id);

      return await client.users().get(id) as AdapterUser;
    },
    getUserByAccount: async (provider_providerAccountId) => {
      const existingUser = await client.users().getUserByAccount(provider_providerAccountId)
      if (!existingUser) return null;
      console.warn('getUserByAccount: ', existingUser);

      return {
        ...existingUser,
        image: existingUser.avatar,
      } as AdapterUser;
    },
    getUserByEmail: async (email: string) => {
      const existingUser = await client.users().getUserByEmail(email)
      if (!existingUser) return null;

      return {
        ...existingUser,
        image: existingUser.avatar,
      } as AdapterUser;
    },
    linkAccount: async (data) => {
      await client.accounts().create({
        user_id: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        refresh_token: data.refresh_token,
        access_token: data.access_token,
        expires_at: data.expires_at,
        token_type: data.token_type,
        scope: data.scope,
        id_token: data.id_token,
        session_state: data.session_state,
        oauth_token_secret: data.oauth_token_secret as string,
        oauth_token: data.oauth_token as string,
        refresh_token_expires_in: data.refresh_token_expires_in as number,
      });
    }
  };
}