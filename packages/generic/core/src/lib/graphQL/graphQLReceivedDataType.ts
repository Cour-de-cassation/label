import { idType } from '../../modules';

export type { graphQLReceivedDataType };

type graphQLReceivedDataType<T> = {
  [key in keyof T]: T[key] extends idType | Date ? string : T[key];
};
