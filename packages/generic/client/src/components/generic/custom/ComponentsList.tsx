import React, { ReactElement } from 'react';

export { ComponentsList };

function ComponentsList(props: { components: ReactElement[]; spaceBetweenComponents: number }): ReactElement {
  const style = buildStyle();

  return (
    <>
      {props.components.reduce(
        (componentList, component, ind) => [
          ...componentList,
          <span key={ind}>{component}</span>,
          <span style={style.spaceBetweenComponents} />,
        ],
        [<span style={style.spaceBetweenComponents} />],
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
