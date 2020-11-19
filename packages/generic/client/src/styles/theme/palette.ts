import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import brown from '@material-ui/core/colors/brown';
import cyan from '@material-ui/core/colors/cyan';
import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';
import lightBlue from '@material-ui/core/colors/lightBlue';
import lime from '@material-ui/core/colors/lime';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import teal from '@material-ui/core/colors/teal';
import yellow from '@material-ui/core/colors/yellow';
import { colorType, constantColorType, displayModeType, shadeColorType } from '@label/core';

export { emphasizeShadeColor, getColor, getShadeColor };

const COLORS: { [color in constantColorType]: string } = {
  black: '#000000',
  white: '#FFFFFF',
};

const shadeColors: { [color in shadeColorType[0]]: { [shade: number]: string } } = {
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lime,
  orange,
  pink,
  red,
  teal,
  yellow,
};

function emphasizeShadeColor(color: colorType, displayMode: displayModeType): string {
  if (typeof color === 'string') {
    switch (color) {
      case 'black':
        return 'white';
      case 'white':
        return 'black';
    }
  } else {
    const [tint] = color;

    switch (displayMode) {
      case 'darkMode':
        return getShadeColor([tint, 100]);
      case 'lightMode':
        return getShadeColor([tint, 800]);
    }
  }
}

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
