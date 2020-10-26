export type { dataModelFieldType, dataModelType };

type dataModelType<T> = {
  [key in keyof T]: {
    type: dataModelFieldType;
    graphQL: boolean;
  };
};

type dataModelFieldType = "boolean" | "date" | "id" | "string" | "number";
