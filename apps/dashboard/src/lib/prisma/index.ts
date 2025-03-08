/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from 'db'

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient
}

const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    /*
    log: process.env.NODE_ENV === 'development' ? [
      {
        emit: 'stdout',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ] : ['error'],
    */
  })
 
if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma
}

export default prisma
 