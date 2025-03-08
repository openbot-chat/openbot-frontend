
import { authenticationClient } from "@/lib/authok";
import { CredentialsConfig } from "next-auth/providers";


// 参考: https://github.com/igorovic/auth0-next-custom-login/blob/4d8427e519207f3dda1034119a73f764acb8d4e3/pages/api/auth/%5B...nextauth%5D.ts


export interface SmsConfig extends CredentialsConfig {
  type: 'credentials';
  options: SmsUserConfig;
}

export type SmsUserConfig = Partial<Omit<SmsConfig, "options">>

export type SmsProvider = (options: SmsUserConfig) => SmsConfig


export default function Sms(options: SmsUserConfig): SmsConfig {
  return {
    id: 'sms',
    type: 'credentials',
    name: 'Sms',
    credentials: {
      phone_number: { type: 'string'},
      vcode: { type: 'string'},
    },
    options,
    authorize: async (credentials, /*req*/) => {
      console.log('authorize', credentials);

      let user = null;

      const { phone_number: username, vcode: otp } = credentials;

      const res = await authenticationClient.passwordless.signIn({
        username,
        otp,
        realm: 'sms',
      });

      if (res && res.access_token) {
        const profile = await authenticationClient.users.getInfo(res.access_token);
        user = {
          id: profile.user_id,
          name: profile.nickname,
          image: profile.picture,
        }
        console.log('user: ', user);
      }

      return user;
    }
  }
}