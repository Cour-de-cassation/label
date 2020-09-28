import { sign as jsonwebtokenSign, verify } from 'jsonwebtoken';
import { userType } from '@label/core';

export { jwtSigner };

const LOCAL_SECRET = 'labelSecret+2020$';

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const jwtSigner = {
  sign,
  verifyToken,
};

function sign(userId: userType['_id']): string {
  return jsonwebtokenSign({ userId }, LOCAL_SECRET, { expiresIn: ONE_WEEK });
}

function verifyToken(token: string): string {
  const decodedToken: string | { userId?: string } = verify(
    token,
    LOCAL_SECRET,
  );
  if (
    typeof decodedToken === 'string' ||
    !decodedToken ||
    !decodedToken.userId
  ) {
    throw new Error(
      `Invalid userId in decoded token : ${JSON.stringify(decodedToken)}`,
    );
  }
  return decodedToken.userId;
}
