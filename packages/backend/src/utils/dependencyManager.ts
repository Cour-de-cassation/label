export { dependencyManager };

const dependencyManager = {
  inject<T>({
    forLocal,
    forProd,
    forTest,
  }: {
    forLocal: T;
    forProd: T;
    forTest: T;
  }) {
    switch (process.env.RUN_MODE) {
      case 'LOCAL':
        return forLocal;
      case 'PROD':
        return forProd;
      case 'TEST':
        return forTest;
      default:
        return forProd;
    }
  },
};
