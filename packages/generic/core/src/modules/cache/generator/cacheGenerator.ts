import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { cacheType } from '../cacheType';

export { cacheGenerator };

const cacheGenerator: generatorType<cacheType> = {
  generate: ({ key, _id, updateDate, content } = {}) => ({
    key: key ?? 'random' + Math.floor(Math.random() * 10000),
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    updateDate: updateDate ?? new Date().getTime(),
    content: content ?? '',
  }),
};
