import { colorType, shadeColorType } from '@label/core';

export type { customColorsType };

type customColorsType = {
  alert: shadeColorType;
  background: colorType;
  default: shadeColorType;
  disabled: { background: shadeColorType; color: colorType };
  document: colorType;
  dropdown: {
    border: colorType;
  };
  error: shadeColorType;
  icon: colorType;
  primary: shadeColorType;
  line: { level1: colorType; level2: shadeColorType };
  warning: shadeColorType;
};
