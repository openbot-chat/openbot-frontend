import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next'


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('slack callback code: ', req.query.code);

  const response = await axios({
    method: 'get',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8"
    },
    url: 'https://slack.com/api/oauth.v2.access',
    params: {
      client_id: '4598060091297.5277393611057',
      client_secret: '064ebc6ccd4e48866e0042a00a86ab8c',
      code: req.query.code,
      // redirect_uri: 'https://aiplugin123.loca.lt/api/oauth/callback/slack',
    }
  });

  // TODO save credentials to api service

  const accessToken = response.data.access_token;
  console.log('response: ', response);
}

export default handler;