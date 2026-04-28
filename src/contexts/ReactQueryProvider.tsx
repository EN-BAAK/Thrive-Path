import React, { useState } from 'react'
import { CommonParentProps } from '../types/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ReactQueryProvider: React.FC<CommonParentProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchInterval: false,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
          },

        },
      })
  );

  return (
    <QueryClientProvider client={queryClient} >
      {children}
    </QueryClientProvider>
  );
}

export default ReactQueryProvider