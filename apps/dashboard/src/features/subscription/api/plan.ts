import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc-server'
import { 
  FeatureType,
  PlanEnum, 
  pageSchemaFactory, 
} from 'models'
import { 
  client,
} from '@/server/api/openbot-js'

export const planRouter = router({
  list: protectedProcedure
    .query(async () => {
      return [
        {
          slug: PlanEnum.FREE,
          name: 'FREE',
          features: [
            {
              slug: 'seats_limit',
              name: 'Seats Limit',
              type: FeatureType.QUOTA,
              quantity: 1,
            }
          ]
        },
        {
          slug: PlanEnum.FREE,
          name: 'FREE',
          features: [
            {
              slug: 'seats_limit',
              name: 'Seats Limit',
              type: FeatureType.QUOTA,
              quantity: 1,
            }
          ]
        }
      ]
      
      // return await client.plans().list({})
    }),
})