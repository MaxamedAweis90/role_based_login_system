const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_role_based_rbac_system_key_2026_gemini';

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Verify JWT token in the Edge Runtime (e.g. Next.js Middleware)
 * using only native Web Crypto APIs.
 */
export async function verifyJWT(token: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    // 1. Decode and parse payload
    const payloadStr = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadStr);

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    // 2. Import secret key for Web Crypto validation
    const keyData = stringToUint8Array(JWT_SECRET);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // 3. Decode signature to byte array
    const signatureBin = base64urlDecode(signatureB64);
    const signatureBytes = new Uint8Array(signatureBin.length);
    for (let i = 0; i < signatureBin.length; i++) {
      signatureBytes[i] = signatureBin.charCodeAt(i);
    }

    // 4. Verify signature validity
    const dataToVerify = stringToUint8Array(`${headerB64}.${payloadB64}`);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      dataToVerify
    );

    return isValid ? payload : null;
  } catch (error) {
    console.error('JWT Edge verification failed:', error);
    return null;
  }
}
