export { dependencyManager };

const dependencyManager = {
  exec({
    execLocal = () => {},
    execProd = () => {},
    execTest = () => {},
  }: {
    execLocal?: () => void;
    execProd?: () => void;
    execTest?: () => void;
  }) {
    switch (process.env.RUN_MODE) {
      case 'LOCAL':
        return execLocal();
      case 'PROD':
        return execProd();
      case 'TEST':
        return execTest();
      default:
        return execProd();
    }
  },
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
