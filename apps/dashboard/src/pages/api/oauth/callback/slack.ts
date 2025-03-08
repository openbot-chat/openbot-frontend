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
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code,
      // redirect_uri: 'https://aiplugin123.loca.lt/api/oauth/callback/slack',
    }
  });

  // TODO save credentials to api service

  const accessToken = response.data.access_token;
  console.log('response: ', response);
}

export default handler;