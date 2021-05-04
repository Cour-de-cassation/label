export { buildModel };

export type {
  buildType,
  buildPrimitiveType,
  buildConstantType,
  customMappingType,
  modelType,
  modelCasePrimitiveType,
  modelCaseConstantType,
  modelCaseCustomType,
  modelCaseObjectType,
  modelCaseArrayType,
  modelPrimitiveType,
  modelConstantType,
  modelObjectType,
};

type modelType =
  | modelCasePrimitiveType
  | modelCaseConstantType
  | modelCaseCustomType
  | modelCaseOrType
  | modelCaseObjectType
  | modelCaseArrayType;

type modelCasePrimitiveType = {
  kind: 'primitive';
  content: modelPrimitiveType;
};

type modelCaseConstantType = {
  kind: 'constant';
  content: modelConstantType;
};

type modelCaseCustomType = {
  kind: 'custom';
  content: string;
};

type modelCaseOrType = { kind: 'or'; content: Readonly<[modelOrEntryType, modelOrEntryType]> };

type modelCaseObjectType = {
  kind: 'object';
  content: modelObjectType;
};

type modelCaseArrayType = {
  kind: 'array';
  content: modelType;
};

type modelPrimitiveType = 'boolean' | 'date' | 'number' | 'string' | 'undefined' | 'void';

type modelConstantType = readonly string[];

type modelOrEntryType =
  | modelCasePrimitiveType
  | modelCaseConstantType
  | modelCaseCustomType
  | modelCaseObjectType
  | modelCaseArrayType;

type modelObjectType = { [key in string]: modelType };

/* eslint-disable @typescript-eslint/ban-types */
type buildType<
  modelT extends modelType,
  customMappingT extends customMappingType = {}
> = modelT extends modelCasePrimitiveType
  ? buildPrimitiveType<modelT['content']>
  : modelT extends modelCaseConstantType
  ? buildConstantType<modelT['content']>
  : modelT extends modelCaseCustomType
  ? customMappingT[modelT['content']]
  : modelT extends modelCaseOrType
  ? buildOrEntryType<modelT['content'][0], customMappingT> | buildOrEntryType<modelT['content'][1], customMappingT>
  : modelT extends modelCaseObjectType
  ? {
      [key in keyof modelT['content']]: buildType<modelT['content'][key], customMappingT>;
    }
  : modelT extends modelCaseArrayType
  ? Array<buildType<modelT['content'], customMappingT>>
  : never;

type buildPrimitiveType<modelPrimitiveT extends modelPrimitiveType> = modelPrimitiveT extends 'boolean'
  ? boolean
  : modelPrimitiveT extends 'date'
  ? Date
  : modelPrimitiveT extends 'number'
  ? number
  : modelPrimitiveT extends 'string'
  ? string
  : modelPrimitiveT extends 'undefined'
  ? undefined
  : modelPrimitiveT extends 'void'
  ? void
  : never;

type buildConstantType<modelConstantT extends modelConstantType> = modelConstantT[number];

type buildOrEntryType<
  modelOrEntryT extends modelOrEntryType,
  customMappingT extends customMappingType = {}
> = modelOrEntryT extends modelCasePrimitiveType
  ? buildPrimitiveType<modelOrEntryT['content']>
  : modelOrEntryT extends modelCaseConstantType
  ? buildConstantType<modelOrEntryT['content']>
  : modelOrEntryT extends modelCaseArrayType
  ? Array<buildType<modelOrEntryT['content'], customMappingT>>
  : modelOrEntryT extends modelCaseCustomType
  ? customMappingT[modelOrEntryT['content']]
  : modelOrEntryT extends modelCaseObjectType
  ? {
      [key in keyof modelOrEntryT['content']]: buildType<modelOrEntryT['content'][key], customMappingT>;
    }
  : never;

type customMappingType = { [typeName: string]: any };

function buildModel<modelT extends modelType>(model: modelT) {
  return model;
}
