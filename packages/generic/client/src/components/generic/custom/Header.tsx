import React, { ReactElement, CSSProperties } from 'react';
import { heights } from '../../../styles';
import { buildStyledComponentList } from '../../../utils';
import { LayoutGrid } from '../materialUI';

export { Header };

function Header(props: {
  leftHeaderComponents: ReactElement[];
  rightHeaderComponents: ReactElement[];
  style?: CSSProperties;
}): ReactElement {
  const styles = buildStyles();

  return (
    <LayoutGrid container style={{ ...props.style, ...styles.container }}>
      <LayoutGrid container item xs={6}>
        <LayoutGrid container item alignItems="center">
          {buildStyledComponentList(props.leftHeaderComponents)}
        </LayoutGrid>
      </LayoutGrid>
      <LayoutGrid container item xs={6}>
        <LayoutGrid container item justifyContent="flex-end" alignItems="center">
          {buildStyledComponentList(props.rightHeaderComponents)}
        </LayoutGrid>
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles() {
    return {
      container: {
        height: heights.panelHeader,
      },
    };
  }
}
