import { displayModeType, shadeColorType } from '@label/core';
import { dependencyManager } from '../../../utils';

export { primaryColors };

const primaryColors = dependencyManager.inject<Record<displayModeType, shadeColorType>>({
  forPreProd: { darkMode: ['lightGreen', 900], lightMode: ['lightGreen', 500] },
  forProd: { darkMode: ['cyan', 800], lightMode: ['cyan', 600] },
});
