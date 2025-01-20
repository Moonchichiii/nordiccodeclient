// react-query.ts
import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { persistQueryClient } from '@tanstack/react-query-persist-client'

/**
 * Creates a storage persister for synchronizing query cache with localStorage.
 * @type {SyncStoragePersister}
 */
const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'NORDIC_CACHE',
    throttleTime: 1000,
})

/**
 * Initializes a QueryClient with default options for caching and query behavior.
 * @type {QueryClient}
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 300000, // 5 minutes
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

/**
 * Sets up persistence for the QueryClient using the defined persister.
 * @param {QueryClient} queryClient - The QueryClient instance to persist.
 * @param {SyncStoragePersister} persister - The storage persister to use.
 */
persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    dehydrateOptions: {
        shouldDehydrateQuery: query => {
            const persistedQueries = ['auth-user']
            return persistedQueries.includes(query.queryKey[0] as string)
        },
    },
})