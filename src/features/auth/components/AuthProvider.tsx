import { createContext, useContext, ReactNode, JSX } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { AuthUser } from '../types'

interface AuthContextType {
    user: AuthUser | null
    isLoading: boolean
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const auth = useAuth()

    return (
        <AuthContext.Provider
            value={{
                user: auth.user ?? null,
                isLoading: auth.isLoading,
                isAuthenticated: auth.isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}