import { idModule, omitIdType } from '../../id';
import { cacheType } from '../cacheType';

export { buildCache };

function buildCache(cacheFields: omitIdType<cacheType>): cacheType {
  return {
    ...cacheFields,
    _id: idModule.lib.buildId(),
  };
}
