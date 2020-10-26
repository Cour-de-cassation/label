import { dataModelFieldType } from "../types";
import { graphQLCustomTypes } from "./graphQLCustomTypes";

export type {
  graphQLSchemaType,
  graphQLMutationType,
  graphQLQueryType,
  graphQLEntryType,
  graphQLTypeType,
};

type graphQLSchemaType = {
  mutation: graphQLMutationType;
  query: graphQLQueryType;
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
  | { kind: "primitive"; type: dataModelFieldType }
  | { kind: "list"; type: graphQLTypeType }
  | { kind: "custom"; type: keyof typeof graphQLCustomTypes };
