import { useQuery } from '@apollo/client';
import { graphQLQuery, typeOfGraphQLType, networkType } from '@label/core';
import { graphQLClientBuilder } from './graphQLClientBuilder';

export { useGraphQLQuery };

function useGraphQLQuery<queryEntryNameT extends keyof typeof graphQLQuery>(
  queryEntryName: queryEntryNameT,
  option: { args?: Partial<queryArgsType<queryEntryNameT>>; skip?: boolean } = {},
) {
  return useQuery<queryResultType<queryEntryNameT>>(graphQLClientBuilder.buildQuery(queryEntryName), {
    variables: option.args,
    skip: option.skip,
  });
}

type queryArgsType<queryEntryNameT extends keyof typeof graphQLQuery> = Pick<
  typeof graphQLQuery,
  queryEntryNameT
>[queryEntryNameT] extends { args: { [argName: string]: any } }
  ? {
      [argName in keyof Pick<typeof graphQLQuery, queryEntryNameT>[queryEntryNameT]['args']]: typeOfGraphQLType<
        Pick<typeof graphQLQuery, queryEntryNameT>[queryEntryNameT]['args'][argName]
      >;
    }
  : never;

type queryResultType<queryEntryNameT extends keyof typeof graphQLQuery> = {
  [key in keyof Pick<typeof graphQLQuery, queryEntryNameT>]: networkType<
    typeOfGraphQLType<Pick<typeof graphQLQuery, queryEntryNameT>[key]['type']>
  >;
};
