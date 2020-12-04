import React, { MouseEvent, ReactElement, useState } from 'react';

export { useMousePosition, MouseMoveListener };

export type { mousePositionType };

type mousePositionType = {
  x: number;
  y: number;
};

type mouseMoveHandlerType = {
  mousePosition: mousePositionType;
  setMousePosition: (mousePosition: mousePositionType) => void;
};

function useMousePosition(): mouseMoveHandlerType {
  const [mousePosition, setMousePosition] = useState<mousePositionType>({ x: 0, y: 0 });
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
