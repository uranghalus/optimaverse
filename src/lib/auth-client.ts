import { expoClient } from '@better-auth/expo/client';
import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_BETTER_AUTH_URL!, // Base URL of your Better Auth backend.
  fetchOptions: {
    headers: {
      Origin: process.env.EXPO_PUBLIC_BETTER_AUTH_URL!,
    },
  },
  plugins: [
    expoClient({
      scheme: 'optimaverse',
      storagePrefix: 'optimaverse-auth',
      storage: SecureStore,
    }),
    organizationClient(),
  ],
});
