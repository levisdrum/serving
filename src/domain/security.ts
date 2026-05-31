import CryptoJS from 'crypto-js';

const STORAGE_SECRET = 'servin-local-secret-v1';

export function hashPassword(password: string) {
  return CryptoJS.SHA256(password).toString();
}

export function encryptState(raw: string) {
  return CryptoJS.AES.encrypt(raw, STORAGE_SECRET).toString();
}

export function decryptState(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, STORAGE_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}
