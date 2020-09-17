import jwt from 'jsonwebtoken';

export { jwtSigner };

const LOCAL_SECRET = 'labelSecret+2020$';

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const jwtSigner = {
  sign,
};

function sign(userId: string) {
  return jwt.sign({ userId }, LOCAL_SECRET, { expiresIn: ONE_WEEK });
}
