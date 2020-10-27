import {
  graphQLMutationType,
  graphQLQueryType,
  graphQLEntryType,
  typeOfGraphQLType,
  networkType,
} from '@label/core';

export type { resolversType };

type resolversType<
  graphQLSchemaT extends graphQLMutationType | graphQLQueryType
> = graphQLSchemaT extends graphQLMutationType
  ? {
      [mutationEntry in keyof graphQLSchemaT]: resolverType<
        graphQLSchemaT[mutationEntry]
      >;
    }
  : graphQLSchemaT extends graphQLQueryType
  ? {
      [queryEntry in keyof graphQLSchemaT]: resolverType<
        graphQLSchemaT[queryEntry]
      >;
    }
  : never;

type resolverType<graphQLEntryT extends graphQLEntryType> = (
  _root: unknown,
  args: {
    [argName in keyof graphQLEntryT['args']]: networkType<
      typeOfGraphQLType<graphQLEntryT['args'][argName]>
    >;
  },
  context: unknown,
) => Promise<typeOfGraphQLType<graphQLEntryT['type']>>;
