import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { LoginCredentials, RegisterCredentials, AuthResponse, AuthUser } from '../types'
import { toast } from 'react-toastify'

export function useAuth() {
    const queryClient = useQueryClient()

    const { data: user, isLoading } = useQuery<AuthUser | null>({
        queryKey: ['auth-user'],
        queryFn: authApi.getCurrentUser,
        retry: false,
        staleTime: Infinity,
    })

    const login = useMutation<AuthResponse, Error, LoginCredentials>({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            queryClient.setQueryData<AuthUser>(['auth-user'], data.user)
            toast.success('Successfully logged in!')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to login')
        },
    })

    const register = useMutation<AuthResponse, Error, RegisterCredentials>({
        mutationFn: authApi.register,
        onSuccess: (data) => {
            queryClient.setQueryData<AuthUser>(['auth-user'], data.user)
            toast.success('Successfully registered! Please verify your email.')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to register')
        },
    })

    const logout = useMutation<void, Error>({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.setQueryData(['auth-user'], null)
            queryClient.clear()
            toast.success('Successfully logged out!')
        },
    })

    return {
        user,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated: Boolean(user),
    }
}
