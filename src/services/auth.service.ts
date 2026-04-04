import api from './api';
import CryptoJS from 'crypto-js';
import bigInt from 'big-integer';
import type { LoginRequest, RegisterRequest, JwtResponse, MessageResponse } from '../types/auth';

// Hàm phụ trợ: Chuyển chuỗi (String) sang dạng Hexa (để chuẩn bị cho tính toán RSA)
const stringToHex = (str: string) => {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    // Đảm bảo mỗi ký tự luôn biến thành 2 số hexa (ví dụ: 'a' -> '61')
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
};

export const authService = {
  // ──────────────────────────────────────────────────────────────────────────
  // LOGIN BẢO MẬT (HYBRID ENCRYPTION: RSA CHAY + AES)
  // ──────────────────────────────────────────────────────────────────────────
  login: async (data: LoginRequest) => {
    try {
      // Bước 1: Gọi API lấy 2 số N và E (dạng Hexa) từ thư viện RSA code chay của Backend
      const publicKeyResponse = await api.get<{ n: string; e: string }>('/auth/public-key');
      const { n: nHex, e: eHex } = publicKeyResponse.data;

      // Bước 2: Sinh một Session Key (khóa AES) ngẫu nhiên dài đúng 16 ký tự
      const sessionKey = Math.random().toString(36).substring(2, 10) +
                         Math.random().toString(36).substring(2, 10);

      // Bước 3: Mã hóa thông tin đăng nhập (email, password) bằng AES (với mode ECB để khớp Backend)
      const payloadStr = JSON.stringify(data);
      const encryptedPayload = CryptoJS.AES.encrypt(
        payloadStr,
        CryptoJS.enc.Utf8.parse(sessionKey),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7, // PKCS7 bên JS tương đương PKCS5 bên Java
        }
      ).toString(); // Mặc định toString() sẽ ra chuỗi Base64

      // Bước 4: Mã hóa cái Session Key bằng RSA Toán học (C = M^E mod N)
      // Ép kiểu các chuỗi Hexa sang BigInteger
      const mBigInt = bigInt(stringToHex(sessionKey), 16);
      const nBigInt = bigInt(nHex, 16);
      const eBigInt = bigInt(eHex, 16);

      // Thực hiện phép lũy thừa modulo cốt lõi của RSA
      const cBigInt = mBigInt.modPow(eBigInt, nBigInt);
      
      // Chuyển kết quả C thành chuỗi Hexa để ném cho Backend
      const encryptedSessionKey = cBigInt.toString(16);

      // Bước 5: Đóng gói và gửi lên Backend
      const response = await api.post<JwtResponse>('/auth/login', {
        encryptedPayload: encryptedPayload,
        encryptedSessionKey: encryptedSessionKey,
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi trong quá trình đăng nhập bảo mật:', error);
      throw error;
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // REGISTER (Tạm giữ nguyên)
  // ──────────────────────────────────────────────────────────────────────────
  // REGISTER BẢO MẬT (HYBRID ENCRYPTION)
  // ──────────────────────────────────────────────────────────────────────────
  register: async (data: RegisterRequest) => {
    try {
      // 1. Lấy khóa RSA công khai
      const publicKeyResponse = await api.get<{ n: string; e: string }>('/auth/public-key');
      const { n: nHex, e: eHex } = publicKeyResponse.data;

      // 2. Sinh Session Key (AES-128)
      const sessionKey = Math.random().toString(36).substring(2, 10) +
                         Math.random().toString(36).substring(2, 10);

      // 3. Mã hóa toàn bộ Form Đăng ký bằng AES
      const payloadStr = JSON.stringify(data);
      const encryptedPayload = CryptoJS.AES.encrypt(
        payloadStr,
        CryptoJS.enc.Utf8.parse(sessionKey),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }
      ).toString();

      // 4. Mã hóa Session Key bằng RSA Toán học
      const mBigInt = bigInt(stringToHex(sessionKey), 16);
      const nBigInt = bigInt(nHex, 16);
      const eBigInt = bigInt(eHex, 16);
      const cBigInt = mBigInt.modPow(eBigInt, nBigInt);
      const encryptedSessionKey = cBigInt.toString(16);

      // 5. Gửi lên Backend
      const response = await api.post<MessageResponse>('/auth/register', {
        encryptedPayload: encryptedPayload,
        encryptedSessionKey: encryptedSessionKey,
      });

      return response.data;
    } catch (error) {
      console.error('Lỗi trong quá trình đăng ký bảo mật:', error);
      throw error;
    }
  },
};