import { buildFakeNlpApi } from './buildFakeNlpApi';
import { buildNlpApi } from './buildNlpApi';
import { nlpApiType } from './nlpApiType';

export { nlpApi };

const nlpApi: nlpApiType = true ? buildFakeNlpApi() : buildNlpApi(); // For now, we only use fake
