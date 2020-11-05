import React, { ReactElement } from 'react';

export { buildComponentList };

function buildComponentList(components: ReactElement[], spaceBetweenComponents: number): ReactElement[] {
  const style = buildStyle();

  return components.reduce(
    (componentList, component, ind) => [
      ...componentList,
      <div key={ind}>{component}</div>,
      <div style={style.spaceBetweenComponent} />,
    ],
    [<div style={style.spaceBetweenComponent} />],
  );

  function buildStyle() {
    return {
      spaceBetweenComponent: {
        paddingRight: spaceBetweenComponents,
      },
    };
  }
}
