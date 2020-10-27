import {
  idType,
  dataModelFieldType,
  typeOfDataModelFieldType,
} from "../modules";
import { graphQLCustomTypes } from "./graphQLCustomTypes";

export type {
  graphQLMutationType,
  graphQLQueryType,
  graphQLEntryType,
  graphQLTypeType,
  typeOfGraphQLType,
  networkType,
};

type graphQLMutationType = {
  [mutationEntry: string]: graphQLEntryType;
};

type graphQLQueryType = {
  [queryEntry: string]: graphQLEntryType;
};

type graphQLEntryType = {
  type: graphQLTypeType;
  args?: { [argName: string]: graphQLTypeType };
};

type graphQLTypeType =
  | graphQLTypePrimitiveType
  | { kind: "list"; type: graphQLTypeType }
  | graphQLTypeCustomType;

type graphQLTypePrimitiveType = { kind: "primitive"; type: dataModelFieldType };

type graphQLTypeCustomType = {
  kind: "custom";
  type: keyof typeof graphQLCustomTypes;
};

type typeOfGraphQLType<graphQLT> = graphQLT extends graphQLTypePrimitiveType
  ? typeOfDataModelFieldType<graphQLT["type"]>
  : graphQLT extends {
      kind: "list";
      type: graphQLTypeCustomType;
    }
  ? Array<typeOfGraphQLCustomType<graphQLT["type"]["type"]>>
  : graphQLT extends graphQLTypeCustomType
  ? typeOfGraphQLCustomType<graphQLT["type"]>
  : never;

type typeOfGraphQLCustomType<
  graphQLCustomT extends keyof typeof graphQLCustomTypes
> = {
  [key in keyof typeof graphQLCustomTypes[graphQLCustomT]["fields"]]: typeOfDataModelFieldType<
    typeof graphQLCustomTypes[graphQLCustomT]["fields"][key]
  >;
};

type networkType<T> = T extends { [key: string]: unknown }
  ? { [key in keyof T]: networkType<T[key]> }
  : T extends Array<unknown>
  ? Array<networkType<T[0]>>
  : T extends idType
  ? string
  : T extends Date
  ? string
  : T;
