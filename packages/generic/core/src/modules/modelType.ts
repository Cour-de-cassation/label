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

type customMappingType = { [typeName: string]: any };

function buildModel<modelT extends modelType>(model: modelT) {
  return model;
}
