import { buildType, idType } from '../modules';
import { apiSchema, apiSchemaMethodNameType } from './apiSchema';

export type { apiRouteInType, apiRouteOutType, networkType };

type apiRouteInType<
  methodNameT extends apiSchemaMethodNameType,
  routeNameT extends keyof typeof apiSchema[methodNameT]
> = Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT] extends { in: { [argName: string]: any } }
  ? {
      [argName in keyof Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT]['in']]: buildType<
        Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT]['in'][argName],
        { id: idType }
      >;
    }
  : undefined;

type apiRouteOutType<
  methodNameT extends apiSchemaMethodNameType,
  routeNameT extends keyof typeof apiSchema[methodNameT]
> = Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT] extends { out: any }
  ? buildType<Pick<typeof apiSchema[methodNameT], routeNameT>[routeNameT]['out'], { id: idType }>
  : never;

type networkType<T> = T extends { [key: string]: unknown }
  ? { [key in keyof T]: networkType<T[key]> }
  : T extends Array<unknown>
  ? Array<networkType<T[0]>>
  : T extends idType
  ? string
  : T extends Date
  ? string
  : T;
