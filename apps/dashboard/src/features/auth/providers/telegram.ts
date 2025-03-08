import CredentialsProvider from 'next-auth/providers/credentials';
import { objectToAuthDataMap, AuthDataValidator } from '@telegram-auth/server';


const telegramProvider = CredentialsProvider({
  // The name to display on the sign in form (e.g. 'Sign in with...')
  name: 'Telegram',
  id: 'telegram',
  // type: 'oauth',
  // The credentials is used to generate a suitable form on the sign in page.
  // You can specify whatever fields you are expecting to be submitted.
  // e.g. domain, username, password, 2FA token, etc.
  //id: 17929435,first_name: "Bce",last_name: "L",username: "bi",auth_date: 1672121611,hash: "a3e1f98d473039d2af3ebfb3bffcbfb85f92afc4a3a53786eb6ce110ddedf8ce"

  credentials: {
    id: { label: 'id', type: 'text' },
    first_name: { label: 'first_name', type: 'text' },
    last_name: { label: 'last_name', type: 'text' },
    username: { label: 'username', type: 'text' },
    photo_url: { label: 'photo_url', type: 'text' },
    auth_date: { label: 'auth_date', type: 'text' },
    hash: { label: 'hash', type: 'text' }
  },
  async authorize (credentials, req) {
    const validator = new AuthDataValidator({ botToken: `${process.env.TELEGRAM_BOT_TOKEN}` });
    const data = objectToAuthDataMap(req.query || {});

    const user = await validator.validate(data);
    if (user.id && user.first_name) {
      // 要创建 custom user

      return {
        id: user.id.toString(),
        name: [user.first_name, user.last_name || ''].join(' '),
        image: user.photo_url,
      };
    }

    return null;
  }
});

export default telegramProvider;