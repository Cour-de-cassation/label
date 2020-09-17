import jwt from 'jsonwebtoken';
import { userType } from '@label/core';

export { jwtSigner };

const LOCAL_SECRET = 'labelSecret+2020$';

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const jwtSigner = {
  sign,
};

type userIdType = Pick<userType, '_id'>;

function sign(userId: userIdType) {
  return jwt.sign({ userId }, LOCAL_SECRET, { expiresIn: ONE_WEEK });
}
