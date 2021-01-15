export { dependencyManager };

const dependencyManager = {
  inject<T>({ forLocal, forPreProd, forProd, forTest }: { forLocal?: T; forPreProd?: T; forProd: T; forTest?: T }) {
    switch (process.env.RUN_MODE) {
      case 'LOCAL':
        return forLocal || forProd;
      case 'PREPROD':
        return forPreProd || forProd;
      case 'PROD':
        return forProd;
      case 'TEST':
        return forTest || forProd;
      default:
        return forProd;
    }
  },
};
