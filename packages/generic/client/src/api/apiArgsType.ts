import { apiSchema, apiSchemaMethodNameType, networkType, typeOfDataModelEntryType } from '@label/core';

export type { apiArgsType, apiResultType };

type apiArgsType<
  methodNameT extends apiSchemaMethodNameType,
  routeNameT extends keyof typeof apiSchema[methodNameT]
> = Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT] extends { in: { [argName: string]: any } }
  ? {
      [argName in keyof Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT]['in']]: typeOfDataModelEntryType<
        Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT]['in'][argName]
      >;
    }
  : never;

type apiResultType<
  methodNameT extends apiSchemaMethodNameType,
  routeNameT extends keyof typeof apiSchema[methodNameT]
> = Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT] extends { out: any }
  ? networkType<typeOfDataModelEntryType<Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT]['out']>>
  : never;
