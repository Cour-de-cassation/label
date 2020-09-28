export { dataModelFieldType, dataModelType };

type dataModelType<T> = { [key in keyof T]: dataModelFieldType };

type dataModelFieldType = "date" | "mongoIdType" | "string";
