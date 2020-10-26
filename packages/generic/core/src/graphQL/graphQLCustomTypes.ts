import {
  annotationModule,
  annotationType,
  documentModule,
  documentType,
  settingsModule,
} from "../modules";
import { dataModelType, dataModelFieldType } from "../types";

export { graphQLCustomTypes };

export type { graphQLCustomTypeType };

type graphQLCustomTypeType = {
  name: string;
  fields: { [key: string]: dataModelFieldType };
};

const graphQLCustomTypes = {
  annotation: buildGraphQLCustomType<annotationType>(
    "annotation",
    annotationModule.dataModel
  ),
  document: buildGraphQLCustomType<documentType>(
    "document",
    documentModule.dataModel
  ),
  settings: buildGraphQLCustomType("settings", settingsModule.dataModel),
  success: {
    name: "success",
    fields: {
      success: "boolean",
    },
  },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: {
  [customTypeName: string]: graphQLCustomTypeType;
} = graphQLCustomTypes;

function buildGraphQLCustomType<T>(
  name: string,
  dataModel: dataModelType<T>
): graphQLCustomTypeType {
  const graphQLCustomType = {
    name,
    fields: {},
  } as graphQLCustomTypeType;

  for (const key in dataModel) {
    if (dataModel[key].graphQL) {
      graphQLCustomType.fields[key] = dataModel[key].type;
    }
  }

  return graphQLCustomType;
}
