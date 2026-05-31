import CryptoJS from 'crypto-js';

const STORAGE_CIPHER_VERSION = 'v1';
const STORAGE_SECRETS_BY_VERSION: Record<string, string[]> = {
  v1: [
    'servin-local-secret-v1',
    // Legacy alias kept for backward compatibility/rotation fallback.
    'louvor-local-secret-v1'
  ]
};

export function hashPassword(password: string) {
  return CryptoJS.SHA256(password).toString();
}

export function encryptState(raw: string) {
  const secret = STORAGE_SECRETS_BY_VERSION[STORAGE_CIPHER_VERSION][0];
  const encrypted = CryptoJS.AES.encrypt(raw, secret).toString();
  return `${STORAGE_CIPHER_VERSION}:${encrypted}`;
}

export function decryptState(ciphertext: string) {
  const separatorIndex = ciphertext.indexOf(':');
  const hasVersionPrefix = separatorIndex > 0;

  const version = hasVersionPrefix ? ciphertext.slice(0, separatorIndex) : STORAGE_CIPHER_VERSION;
  const payload = hasVersionPrefix ? ciphertext.slice(separatorIndex + 1) : ciphertext;
  const candidateSecrets = STORAGE_SECRETS_BY_VERSION[version] ?? [];

  for (const secret of candidateSecrets) {
    const bytes = CryptoJS.AES.decrypt(payload, secret);
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    if (plain) return plain;
  }

  return '';
}
