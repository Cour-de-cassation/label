import React, { ReactElement } from 'react';
import { buildStyledComponentList } from '../utils';

export { Header };

function Header(props: { leftHeaderComponents: ReactElement[]; rightHeaderComponents: ReactElement[] }): ReactElement {
  const style = buildStyle();

  return (
    <div style={style.headerStyle}>
      <div style={style.leftHeaderComponentsStyle}>
        {buildStyledComponentList(props.leftHeaderComponents, style.headerComponentStyle)}
      </div>
      <div style={style.rightHeaderComponentsStyle}>
        {buildStyledComponentList(props.rightHeaderComponents, style.headerComponentStyle)}
      </div>
    </div>
  );

  function buildStyle() {
    return {
      headerStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
      },
      leftHeaderComponentsStyle: {
        display: 'flex',
      },
      rightHeaderComponentsStyle: {
        display: 'flex',
      },
      headerComponentStyle: {
        alignSelf: 'center',
        padding: '0 5px',
      },
    };
  }
}
