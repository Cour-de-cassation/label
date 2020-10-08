import React, { ReactElement } from 'react';
import { LayoutGrid } from '../materialUI';

export { Header };

function Header(props: { leftHeaderComponents: ReactElement[]; rightHeaderComponents: ReactElement[] }): ReactElement {
  return (
    <LayoutGrid container>
      <LayoutGrid container item xs={6}>
        <LayoutGrid container item alignItems="center">
          {props.leftHeaderComponents}
        </LayoutGrid>
      </LayoutGrid>
      <LayoutGrid container item xs={6}>
        <LayoutGrid container item justifyContent="flex-end" alignItems="center">
          {props.rightHeaderComponents}
        </LayoutGrid>
      </LayoutGrid>
    </LayoutGrid>
  );
}
