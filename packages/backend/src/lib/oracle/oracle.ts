import { oracleType } from './oracleType';
import { buildFakeOracle } from './buildFakeOracle';
import { buildOracle } from './buildOracle';

export { oracle };

const oracle: oracleType = true ? buildFakeOracle() : buildOracle(); // For now, we only use fake
