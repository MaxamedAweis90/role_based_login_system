import jwt from 'jsonwebtoken';
import { verifyJWT } from './jwt-edge';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_role_based_rbac_system_key_2026_gemini';

/**
 * Sign JWT using standard 'jsonwebtoken' (runs on Node.js / API Routes)
 */
export function signJWT(payload: object, expiresIn: string | number = '1h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export { verifyJWT };
