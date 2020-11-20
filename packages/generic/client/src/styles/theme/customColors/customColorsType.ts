import { colorType, shadeColorType } from '@label/core';

export type { customColorsType };

type customColorsType = {
  background: colorType;
  default: shadeColorType;
  disabled: { background: shadeColorType; color: colorType };
  document: colorType;
  dropdown: {
    border: colorType;
  };
  icon: colorType;
  primary: shadeColorType;
  secondary: shadeColorType;
  text: colorType;
};
