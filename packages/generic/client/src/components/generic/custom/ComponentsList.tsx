import React, { ReactElement } from 'react';

export { ComponentsList };

function ComponentsList(props: { components: ReactElement[]; spaceBetweenComponents: number }): ReactElement {
  const style = buildStyle();

  return (
    <div style={style.container}>
      {props.components.reduce(
        (componentList, component, ind) => [
          ...componentList,
          <span key={2 * ind}>{component}</span>,
          <span key={2 * ind + 1} style={style.spaceBetweenComponents} />,
        ],
        [] as ReactElement[],
      )}
    </div>
  );

  function buildStyle() {
    return {
      container: { display: 'flex' },
      spaceBetweenComponents: {
        paddingRight: props.spaceBetweenComponents,
      },
    };
  }
}
