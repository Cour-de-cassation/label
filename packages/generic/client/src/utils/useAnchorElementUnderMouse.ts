import { MouseEvent, useState } from 'react';

export { useAnchorElementUnderMouse };

function useAnchorElementUnderMouse() {
  const [anchorElement, setAnchorElement] = useState<Element | undefined>(undefined);

  return { anchorElementUnderMouse: anchorElement, setAnchorElementUnderMouse };

  function setAnchorElementUnderMouse(event?: MouseEvent<Element>) {
    anchorElement?.remove();

    if (event) {
      const newAnchorElement = document.createElement('span');
      newAnchorElement.style.position = 'absolute';
      newAnchorElement.style.left = `${event.nativeEvent.x}px`;
      newAnchorElement.style.top = `${event.nativeEvent.y}px`;
      event.currentTarget.appendChild(newAnchorElement);

      setAnchorElement(newAnchorElement);
    } else {
      setAnchorElement(undefined);
    }
  }
}
