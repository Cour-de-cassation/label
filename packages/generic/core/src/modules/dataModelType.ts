import { filterType, writeableType } from "../types/utilityTypes";
import { idType } from "./id";

export type {
  dataModelFieldType,
  dataModelType,
  graphQLTypeOfDataModel,
  typeOfDataModel,
  typeOfDataModelFieldType,
};

type dataModelType = {
  [key in string]: {
    type: dataModelFieldType;
    graphQL: boolean;
  };
};

type dataModelFieldType = "boolean" | "date" | "id" | "string" | "number";

type graphQLTypeOfDataModel<dataModelT extends dataModelType> = typeOfDataModel<
  filterType<dataModelT, { graphQL: true }>
>;

type typeOfDataModel<dataModelT extends dataModelType> = writeableType<
  {
    [field in keyof dataModelT]: typeOfDataModelFieldType<
      dataModelT[field]["type"]
    >;
  }
>;

type typeOfDataModelFieldType<
  dataModelFieldT extends dataModelFieldType
> = dataModelFieldT extends "boolean"
  ? boolean
  : dataModelFieldT extends "date"
  ? Date
  : dataModelFieldT extends "id"
  ? idType
  : dataModelFieldT extends "string"
  ? string
  : dataModelFieldT extends "number"
  ? number
  : never;
