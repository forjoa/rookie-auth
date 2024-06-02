import { SignJWT, jwtVerify } from 'jose';
import * as cookie from 'cookie';

const secretKey = 'your-secret-key'; // Cambia esto a una variable de entorno en producción
const key = new TextEncoder().encode(secretKey);

export async function encryptSession(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 week')
    .sign(key);
}

export async function decryptSession(token) {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', cookie.serialize('session', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  }));
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', cookie.serialize('session', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  }));
}

export function getSessionCookie(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.session;
}
