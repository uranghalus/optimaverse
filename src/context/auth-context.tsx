import React, {
    createContext,
    useContext,
} from "react";

import { authClient } from "@/lib/auth-client";

type AuthContextType = {
    session: any;
    user: any;

    isAuthenticated: boolean;
    isChecking: boolean;
};

const AuthContext =
    createContext<AuthContextType | null>(
        null
    );

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const {
        data: session,
        isPending,
    } = authClient.useSession();

    return (
        <AuthContext.Provider
            value={{
                session,

                user:
                    session?.user ?? null,

                isAuthenticated:
                    !!session?.user,

                isChecking: isPending,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}