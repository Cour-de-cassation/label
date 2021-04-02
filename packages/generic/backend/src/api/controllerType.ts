import {
  apiSchemaType,
  apiSchemaMethodNameType,
  apiRouteInType,
  apiRouteOutType,
  networkType,
} from '@label/core';

export type { controllersFromSchemaType };

type controllersFromSchemaType<apiSchemaT extends apiSchemaType> = {
  [methodName in keyof apiSchemaT]: methodName extends apiSchemaMethodNameType
    ? {
        [controllerName in keyof apiSchemaT[methodName]]: (req: {
          args: networkType<apiRouteInType<methodName, controllerName>>;
          headers: any;
        }) => Promise<apiRouteOutType<methodName, controllerName>>;
      }
    : never;
};
