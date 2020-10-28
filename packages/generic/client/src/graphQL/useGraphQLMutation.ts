import { useMutation } from '@apollo/client';
import { graphQLMutation, typeOfGraphQLType, networkType } from '@label/core';
import { graphQLClientBuilder } from './graphQLClientBuilder';

export { useGraphQLMutation };

function useGraphQLMutation<mutationEntryNameT extends keyof typeof graphQLMutation>(
  mutationEntryName: mutationEntryNameT,
) {
  return useMutation<mutationResultType<mutationEntryNameT>, mutationArgsType<mutationEntryNameT>>(
    graphQLClientBuilder.buildMutation(mutationEntryName),
  );
}

type mutationArgsType<mutationEntryNameT extends keyof typeof graphQLMutation> = Pick<
  typeof graphQLMutation,
  mutationEntryNameT
>[mutationEntryNameT] extends { args: { [argName: string]: any } }
  ? {
      [argName in keyof Pick<
        typeof graphQLMutation,
        mutationEntryNameT
      >[mutationEntryNameT]['args']]: typeOfGraphQLType<
        Pick<typeof graphQLMutation, mutationEntryNameT>[mutationEntryNameT]['args'][argName]
      >;
    }
  : never;

type mutationResultType<mutationEntryNameT extends keyof typeof graphQLMutation> = {
  [key in keyof Pick<typeof graphQLMutation, mutationEntryNameT>]: networkType<
    typeOfGraphQLType<Pick<typeof graphQLMutation, mutationEntryNameT>[key]['type']>
  >;
};
