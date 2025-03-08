import { v4 as uuidv4 } from 'uuid'
import { APIRoute, Options, sanitizeKey } from '@openbot/next-upload'
import { NextRequest } from 'next/server'
import path from 'path'

const optionsFetcher = (request: NextRequest): Promise<Options> =>  {
  return {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    key: (req, filename: string) => {
      const ext = path.extname(sanitizeKey(filename))
      // 用当前租户的文件夹
      return 'uploads/' + uuidv4() + ext
    }
  }
}

export const POST = APIRoute.configure(optionsFetcher)