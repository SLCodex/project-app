import { NextRequest } from 'next/server';
import { verifyJwt } from './jwt';

export const getUserFromAuthHeader = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
};
