import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import { customThemeType, typographyType, useCustomTheme } from '../../../styles';

export { SText };

const { Span_Text } = buildStyledComponents();

function SText(props: { children: ReactNode; variant?: typographyType }): ReactElement {
  const theme = useCustomTheme();
  const styleProps = { theme, variant: props.variant };

  return <Span_Text styleProps={styleProps}>{props.children}</Span_Text>;
}

function buildStyledComponents() {
  type stylePropsType = {
    styleProps: {
      theme: customThemeType;
      variant?: typographyType;
    };
  };

  const Span_Text = styled.span<stylePropsType>`
    ${({ styleProps }) => {
      const { fontFamily, fontSize } = styleProps.variant
        ? styleProps.theme.typography[styleProps.variant]
        : styleProps.theme.typography.body1;

      return `
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
      `;
    }}
  `;

  return { Span_Text };
}
