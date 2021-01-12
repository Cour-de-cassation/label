import {
  apiSchemaType,
  apiSchemaEntryType,
  dataModelEntryType,
  networkType,
  typeOfDataModelEntryType,
} from '@label/core';

export type { controllersFromSchemaType };

type controllersFromSchemaType<apiSchemaT extends apiSchemaType> = {
  [methodName in keyof apiSchemaT]: {
    [controllerName in keyof apiSchemaT[methodName]]: controllerFromSchemaType<
      apiSchemaT[methodName][controllerName]
    >;
  };
};

type controllerFromSchemaType<
  apiSchemaEntryT extends apiSchemaEntryType
> = (req: {
  args: {
    [argName in keyof apiSchemaEntryT['in']]: apiSchemaEntryT['in'][argName] extends dataModelEntryType
      ? networkType<typeOfDataModelEntryType<apiSchemaEntryT['in'][argName]>>
      : never;
  };
  headers: any;
}) => Promise<typeOfDataModelEntryType<apiSchemaEntryT['out']>>;
