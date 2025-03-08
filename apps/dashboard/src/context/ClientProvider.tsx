'use client';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc-client';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { getBaseUrl } from '@/utils/utils';
import superjson from 'superjson';


export function ClientProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}