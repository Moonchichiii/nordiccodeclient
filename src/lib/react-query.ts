import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 300000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})