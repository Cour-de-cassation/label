import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';

export { getColor, getShadeColor };

export type { colorType, constantColorType, shadeColorType };

const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
};

const shadeColors = {
  blueGrey: {
    50: blueGrey[50],
    400: blueGrey[400],
  } as { [shade: number]: string },
  grey: {
    100: grey[100],
    400: grey[400],
    500: grey[500],
    800: grey[800],
    900: grey[900],
  } as { [shade: number]: string },
  orange: {
    100: orange[100],
    500: orange[500],
  } as { [shade: number]: string },
  yellow: {
    100: yellow[100],
    600: yellow[600],
  } as { [shade: number]: string },
};

type constantColorType = keyof typeof COLORS;

type shadeColorType = readonly [keyof typeof shadeColors, number];

type colorType = constantColorType | shadeColorType;

function getColor(color: colorType): string {
  if (typeof color === 'string') {
    return COLORS[color];
  } else {
    return getShadeColor(color);
  }
}

function getShadeColor(shadeColor: shadeColorType): string {
  const [tint, shade] = shadeColor;
  return shadeColors[tint][shade];
}
