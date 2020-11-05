import React, { ReactElement } from 'react';

export { ComponentsList };

function ComponentsList(props: { components: ReactElement[]; spaceBetweenComponents: number }): ReactElement {
  const style = buildStyle();

  return (
    <>
      {props.components.reduce(
        (componentList, component, ind) => [
          ...componentList,
          <div key={ind}>{component}</div>,
          <div style={style.spaceBetweenComponents} />,
        ],
        [<div style={style.spaceBetweenComponents} />],
      )}
    </>
  );

  function buildStyle() {
    return {
      spaceBetweenComponents: {
        paddingRight: props.spaceBetweenComponents,
      },
    };
  }
}
