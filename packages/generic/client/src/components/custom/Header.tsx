import React, { ReactElement } from 'react';
import { buildStyledComponentList } from '../../utils';
import { LayoutGrid } from '../materialUI';

export { Header };

function Header(props: { leftHeaderComponents: ReactElement[]; rightHeaderComponents: ReactElement[] }): ReactElement {
  const style = buildStyle();

  return (
    <LayoutGrid container justifyContent="space-between">
      <LayoutGrid item>
        <div style={style.headerComponentsStyle}>
          {buildStyledComponentList(props.leftHeaderComponents, style.headerComponentStyle)}
        </div>
      </LayoutGrid>
      <LayoutGrid item>
        <div style={style.headerComponentsStyle}>
          {buildStyledComponentList(props.rightHeaderComponents, style.headerComponentStyle)}
        </div>
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyle() {
    return {
      headerComponentsStyle: {
        display: 'flex',
      },
      headerComponentStyle: {
        alignSelf: 'center',
        padding: '0 5px',
      },
    };
  }
}
