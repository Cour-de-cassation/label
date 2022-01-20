import React, { MouseEvent, ReactElement, useState } from 'react';
import { positionType } from 'pelta-design-system';

export { useMousePosition, MouseMoveListener };

type mouseMoveHandlerType = {
  mousePosition: positionType;
  setMousePosition: (mousePosition: positionType) => void;
};

function useMousePosition(): mouseMoveHandlerType {
  const [mousePosition, setMousePosition] = useState<positionType>({ x: 0, y: 0 });
  return { mousePosition, setMousePosition };
}

function MouseMoveListener(props: {
  children: ReactElement;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: (event: MouseEvent<Element>) => void;
  mouseMoveHandler: mouseMoveHandlerType;
}) {
  return (
    <span
      onMouseMove={refreshMousePosition}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </span>
  );

  function refreshMousePosition(event: MouseEvent) {
    props.mouseMoveHandler.setMousePosition({ x: event.clientX, y: event.clientY });
  }
}
