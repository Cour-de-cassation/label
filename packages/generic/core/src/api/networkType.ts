import { idType } from '../modules';

export type { networkType };

type networkType<T> = T extends { [key: string]: unknown }
  ? { [key in keyof T]: networkType<T[key]> }
  : T extends Array<unknown>
  ? Array<networkType<T[0]>>
  : T extends idType
  ? string
  : T extends Date
  ? string
  : T;
