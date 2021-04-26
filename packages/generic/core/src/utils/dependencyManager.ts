export { buildDependencyManager };

type injectionValuesType<T> = { forLocal?: T; forPreProd?: T; forProd: T; forTest?: T };

function buildDependencyManager(environmentValue: string | undefined) {
  const dependencyManager = {
    inject<T>(injectionValues: injectionValuesType<T>) {
      switch (environmentValue) {
        case 'LOCAL':
          return injectionValues.forLocal || injectionValues.forProd;
        case 'PREPROD':
          return injectionValues.forPreProd || injectionValues.forProd;
        case 'PROD':
          return injectionValues.forProd;
        case 'TEST':
          return injectionValues.forTest || injectionValues.forProd;
        default:
          return injectionValues.forProd;
      }
    },
  };

  return { dependencyManager };
}
