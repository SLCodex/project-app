import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables.');
}

type JwtPayload = {
  userId: string;
  email: string;
};

export const signJwt = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
