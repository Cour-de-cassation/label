import React, { ReactElement } from 'react';

export { buildStyledComponentList };

function buildStyledComponentList(components: ReactElement[], style: { [key: string]: any }): ReactElement[] {
  return components.map((component, ind) => (
    <div key={ind} style={style}>
      {component}
    </div>
  ));
}
