export { dependencyManager };

const dependencyManager = {
  exec({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    execLocal = () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    execProd = () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
