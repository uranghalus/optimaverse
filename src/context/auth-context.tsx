// context/AuthContext.tsx
import { AuthService } from '@/services/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await AuthService.getSession();
                setIsAuthenticated(session && session.status === 'success');
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isChecking }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);