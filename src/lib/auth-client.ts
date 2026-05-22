import { API_BASE_URL } from '@/constant/api';
import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: API_BASE_URL, // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: 'optimaverse',
      storagePrefix: 'optimaverse-auth',
      storage: SecureStore,
    }),
  ],
});
