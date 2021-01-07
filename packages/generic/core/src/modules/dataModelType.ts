import { filterType, writeableType } from '../types/utilityTypes';
import { idType } from './id';

export type { dataModelFieldType, dataModelType, graphQLTypeOfDataModel, typeOfDataModel, typeOfDataModelFieldType };

type dataModelType = {
  [key in string]: {
    type: dataModelFieldType;
    graphQL: boolean;
  };
};

type dataModelFieldType =
  | 'boolean'
  | 'date'
  | 'id'
  | 'string'
  | 'number'
  | readonly string[]
  | {
      kind: 'list';
      type: dataModelFieldType | { [key in string]: dataModelFieldType };
    };

type graphQLTypeOfDataModel<dataModelT extends dataModelType> = typeOfDataModel<
  filterType<dataModelT, { graphQL: true }>
>;

type typeOfDataModel<dataModelT extends dataModelType> = writeableType<
  {
    [field in keyof dataModelT]: typeOfDataModelFieldType<dataModelT[field]['type']>;
  }
>;

type typeOfDataModelFieldType<dataModelFieldT> = dataModelFieldT extends {
  kind: 'list';
  type: any;
}
  ? dataModelFieldT['type'] extends dataModelFieldType
    ? Array<typeOfDataModelFieldType<dataModelFieldT['type']>>
    : dataModelFieldT['type'] extends { [key in string]: dataModelFieldType }
    ? Array<
        {
          [field in keyof dataModelFieldT['type']]: typeOfDataModelFieldType<dataModelFieldT['type'][field]>;
        }
      >
    : never
  : dataModelFieldT extends 'boolean'
  ? boolean
  : dataModelFieldT extends 'date'
  ? Date
  : dataModelFieldT extends 'id'
  ? idType
  : dataModelFieldT extends 'string'
  ? string
  : dataModelFieldT extends 'number'
  ? number
  : dataModelFieldT extends readonly any[]
  ? dataModelFieldT[number]
  : never;
