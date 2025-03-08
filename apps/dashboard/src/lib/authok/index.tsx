import { AuthenticationClient, ManagementClient } from '@authok/authok-node';

function getAuthenticationClient() {
  const client = new AuthenticationClient({
      clientId: process.env.AUTHOK_CLIENT_ID,
      clientSecret: process.env.AUTHOK_CLIENT_SECRET,
      domain: process.env.AUTHOK_DOMAIN,
  });
  return client;
}

function getManagementClient() {
  const client = new ManagementClient({
      clientId: process.env.AUTHOK_CLIENT_ID,
      clientSecret: process.env.AUTHOK_CLIENT_SECRET,
      domain: process.env.AUTHOK_DOMAIN,
  });
  return client;
}

export const authenticationClient =  getAuthenticationClient();
export const managementClient = getManagementClient();