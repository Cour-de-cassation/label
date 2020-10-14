import { mongoIdType } from "../utils";

export type { graphQLReceivedDataType };

type graphQLReceivedDataType<T> = {
  [key in keyof T]: T[key] extends mongoIdType | Date ? string : T[key];
};
