export type { dataModelFieldType, dataModelType };

type dataModelType<T> = { [key in keyof T]: dataModelFieldType };

type dataModelFieldType = {
  type: "date" | "id" | "string" | "number";
  graphQL: boolean;
};
