export { fakeAuthenticationMiddleware };

const fakeAuthenticationMiddleware = (req: any, res: any, next: any) => {
  next();
};
