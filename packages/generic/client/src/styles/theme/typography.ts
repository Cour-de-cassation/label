export { typography };

export type { typographyType };

const fontSizes = {
  small: 12,
  medium: 16,
  large: 24,
};

const typography = {
  body1: { fontFamily: 'Luciole', fontSize: fontSizes.medium },
  button: { fontFamily: 'Luciole', fontSize: fontSizes.medium },
  body2: { fontFamily: 'Courier New', fontSize: fontSizes.medium, lineHeight: '19px' },
  h1: { fontFamily: 'Luciole', fontSize: fontSizes.large },
  h2: { fontFamily: 'Luciole-Bold', fontSize: fontSizes.medium },
  h3: { fontFamily: 'Luciole', fontSize: fontSizes.small },
};

type typographyType = keyof typeof typography;
