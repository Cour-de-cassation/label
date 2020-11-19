import { colorType, shadeColorType } from '@label/core';

export type { customColorsType };

type customColorsType = {
  alert: shadeColorType;
  background: {
    default: colorType;
    highlight: shadeColorType;
  };
  button: {
    default: shadeColorType;
    disabled: {
      background: shadeColorType;
      color: colorType;
    };
  };
  document: {
    background: colorType;
  };
  dropdown: {
    border: colorType;
  };
  icon: colorType;
  primary: shadeColorType;
  secondary: shadeColorType;
  separator: shadeColorType;
  text: {
    default: colorType;
    disabled: colorType;
  };
};
