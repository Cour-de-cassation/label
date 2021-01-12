import { filterType, writeableType } from '../types/utilityTypes';
import { idType } from './id';

export { buildDataModelEntry };

export type { dataModelEntryType, dataModelType, graphQLTypeOfDataModel, typeOfDataModel, typeOfDataModelEntryType };

type dataModelType = {
  [key in string]: {
    type: dataModelEntryType;
    graphQL: boolean;
  };
};

function buildDataModelEntry<dataModelEntryT extends dataModelEntryType>(dataModelEntry: dataModelEntryT) {
  return dataModelEntry;
}

type dataModelEntryType =
  | {
      kind: 'primitive';
      content: dataModelEntryPrimitiveType;
    }
  | {
      kind: 'constant';
      content: dataModelEntryConstantType;
    }
  | {
      kind: 'object';
      content: { [key in string]: dataModelEntryType };
    }
  | {
      kind: 'list';
      content: dataModelEntryType;
    };

type dataModelEntryPrimitiveType = 'boolean' | 'date' | 'id' | 'string' | 'number';

type dataModelEntryConstantType = readonly string[];

type graphQLTypeOfDataModel<dataModelT extends dataModelType> = typeOfDataModel<
  filterType<dataModelT, { graphQL: true }>
>;

type typeOfDataModel<dataModelT extends dataModelType> = writeableType<
  {
    [field in keyof dataModelT]: typeOfDataModelEntryType<dataModelT[field]['type']>;
  }
>;

type typeOfDataModelEntryType<dataModelEntryT extends dataModelEntryType> = dataModelEntryT extends {
  kind: 'primitive';
  content: dataModelEntryPrimitiveType;
}
  ? typeOfDataModelEntryPrimitiveType<dataModelEntryT['content']>
  : dataModelEntryT extends {
      kind: 'constant';
      content: dataModelEntryConstantType;
    }
  ? typeOfDataModelEntryConstantType<dataModelEntryT['content']>
  : dataModelEntryT extends {
      kind: 'object';
      content: { [key in string]: dataModelEntryType };
    }
  ? {
      [key in keyof dataModelEntryT['content']]: typeOfDataModelEntryType<dataModelEntryT['content'][key]>;
    }
  : dataModelEntryT extends {
      kind: 'list';
      content: dataModelEntryType;
    }
  ? Array<typeOfDataModelEntryType<dataModelEntryT['content']>>
  : never;

type typeOfDataModelEntryPrimitiveType<
  dataModelEntryPrimitiveT extends dataModelEntryPrimitiveType
> = dataModelEntryPrimitiveT extends 'boolean'
  ? boolean
  : dataModelEntryPrimitiveT extends 'date'
  ? Date
  : dataModelEntryPrimitiveT extends 'id'
  ? idType
  : dataModelEntryPrimitiveT extends 'string'
  ? string
  : dataModelEntryPrimitiveT extends 'number'
  ? number
  : never;

type typeOfDataModelEntryConstantType<
  dataModelEntryConstantT extends dataModelEntryConstantType
> = dataModelEntryConstantT[number];
