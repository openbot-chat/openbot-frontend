import { sendRequest } from '@openbot/lib'

export type SayRequest = {
  provider: string;
  identifier: string;
  text: string;
  pitch?: number ;
  rate?: number;
  options?: Record<string, unknown>;
}

export type SayResponse = {
  data: string;
}

export const sayQuery = (req: SayRequest) => 
  sendRequest<SayResponse>({
    url: `${process.env.NEXT_PUBLIC_OPENBOT_WEB_API_BASE_URL}/voices/say`,
    method: 'POST',
    body: req,
  })