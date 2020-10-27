import { filterKeysType } from "./utilityTypes";

export type { filterGraphQLKeysType };

type filterGraphQLKeysType<T> = filterKeysType<T, { graphQL: true }>;
