import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: 'http://192.168.20.185:3456', // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: 'optimaverse',
      storagePrefix: 'optimaverse-auth',
      storage: SecureStore,
    }),
  ],
});
