import React, { ReactElement } from 'react';

export { ComponentsList };

function ComponentsList(props: {
  components: Array<ReactElement | undefined>;
  spaceBetweenComponents: number;
}): ReactElement {
  const style = buildStyle();

  return (
    <div style={style.container}>
      {props.components.filter(Boolean).reduce(
        (componentList, component, ind) => [
          ...componentList,
          <span key={2 * ind} style={style.componentContainer}>
            {component}
          </span>,
          <span key={2 * ind + 1} style={style.spaceBetweenComponents} />,
        ],
        [] as ReactElement[],
      )}
    </div>
  );

  function buildStyle() {
    return {
      container: { display: 'flex' },
      componentContainer: { display: 'flex', alignItems: 'center' },
      spaceBetweenComponents: {
        paddingRight: props.spaceBetweenComponents,
      },
    };
  }
}
