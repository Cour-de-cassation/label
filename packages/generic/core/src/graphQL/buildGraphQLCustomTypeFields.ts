import { filterGraphQLKeysType, dataModelFieldType } from "../types";

export { buildGraphQLCustomTypeFields };

function buildGraphQLCustomTypeFields<
  dataModelT extends {
    [field: string]: { graphQL: boolean; type: dataModelFieldType };
  }
>(
  dataModel: dataModelT
): {
  [k in keyof Pick<
    dataModelT,
    filterGraphQLKeysType<dataModelT>
  >]: dataModelT[k]["type"];
} {
  const graphQLCustomTypeFields = {} as {
    [field in keyof dataModelT]: dataModelFieldType;
  };

  for (const key in dataModel) {
    if (dataModel[key].graphQL) {
      graphQLCustomTypeFields[key] = dataModel[key].type;
    }
  }

  return graphQLCustomTypeFields;
}
