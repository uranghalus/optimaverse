import { authClient } from '@/lib/auth-client';

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}
export const AuthService = {
  login: async (payload: LoginPayload) => {
    try {
      // 2. Gunakan metode signIn.email dari Better Auth
      const { data, error } = await authClient.signIn.email({
        email: payload.email,
        password: payload.password,
        rememberMe: payload.rememberMe,
      });

      // Better Auth mengembalikan object { data, error } alih-alih melempar exception pada status 4xx/5xx
      if (error) {
        throw new Error(error.message || 'Gagal melakukan login');
      }

      return data;
    } catch (error: any) {
      console.error('Login Error:', error);
      throw error;
    }
  },
  /**
   * Fungsi Cek Session
   * Dipanggil saat splash screen atau aplikasi pertama kali dibuka
   */
  getSession: async () => {
    try {
      // 3. Gunakan metode getSession bawaan
      const { data, error } = await authClient.getSession();

      if (error || !data) {
        return null; // Sesi habis atau belum login
      }

      return data;
    } catch (error) {
      console.error('Get Session Error:', error);
      return null;
    }
  },

  /**
   * Fungsi Logout
   */
  logout: async () => {
    try {
      // 4. Gunakan metode signOut bawaan
      const { data, error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || 'Gagal logout');
      }

      return data;
    } catch (error: any) {
      console.error('Logout Error:', error);
      throw error;
    }
  },
};
