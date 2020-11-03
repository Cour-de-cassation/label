import { annotationModule, documentModule, settingsModule, dataModelFieldType } from '../modules';
import { buildGraphQLCustomTypeFields } from './buildGraphQLCustomTypeFields';

export { graphQLCustomTypes };

export type { graphQLCustomTypeType };

type graphQLCustomTypeType = {
  name: string;
  fields: { [key: string]: dataModelFieldType };
};

const graphQLCustomTypes = {
  annotation: {
    name: 'annotation',
    fields: buildGraphQLCustomTypeFields<typeof annotationModule.dataModel>(annotationModule.dataModel),
  },
  document: {
    name: 'document',
    fields: buildGraphQLCustomTypeFields<typeof documentModule.dataModel>(documentModule.dataModel),
  },
  settings: {
    name: 'settings',
    fields: buildGraphQLCustomTypeFields<typeof settingsModule.dataModel>(settingsModule.dataModel),
  },
  success: {
    name: 'success',
    fields: {
      success: 'boolean',
    },
  },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: {
  [customTypeName: string]: graphQLCustomTypeType;
} = graphQLCustomTypes;
