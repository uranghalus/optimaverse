import { API_BASE_URL } from '@/constant/api';

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}
export const AuthService = {
  login: async (payload: LoginPayload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mobile/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // 1. Ambil response sebagai teks terlebih dahulu, BUKAN langsung .json()
      const responseText = await response.text();

      let data;
      try {
        // 2. Coba parse teks tersebut menjadi JSON
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        // Jika gagal di-parse, berarti server mengembalikan HTML error atau kosong
        console.error(
          'SERVER TIDAK MENGEMBALIKAN JSON. Respons server:',
          responseText,
        );
        throw new Error(
          `Error Server (${response.status}): Tidak dapat memproses permintaan.`,
        );
      }

      if (!response.ok) {
        throw new Error(data.message || 'Gagal melakukan login');
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
      const response = await fetch(`${API_BASE_URL}/api/mobile/auth/session`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          // Cookie akan dikirim secara otomatis oleh React Native
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika 401 Unauthorized, berarti sesi habis atau belum login
        return null;
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
      const response = await fetch(`${API_BASE_URL}/api/mobile/auth/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal logout');
      }

      return data;
    } catch (error: any) {
      console.error('Logout Error:', error);
      throw error;
    }
  },
};
