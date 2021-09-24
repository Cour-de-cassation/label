import React from 'react';

export { buildViewerScrollerHandler };

export type { viewerScrollerHandlerHandlerType };

type viewerScrollerHandlerHandlerType = {
  getViewerRef: () => React.MutableRefObject<HTMLDivElement | null>;
  storeCurrentVerticalPosition: () => void;
  scrollToStoredVerticalPosition: () => void;
  scrollToTop: () => void;
};

function buildViewerScrollerHandler(
  viewerRef: React.MutableRefObject<HTMLDivElement | null>,
): viewerScrollerHandlerHandlerType {
  let currentTopPosition = 0;
  return {
    getViewerRef,
    storeCurrentVerticalPosition,
    scrollToStoredVerticalPosition,
    scrollToTop,
  };

  function getViewerRef() {
    return viewerRef;
  }

  function storeCurrentVerticalPosition() {
    const { current } = viewerRef;
    if (current) {
      currentTopPosition = current.scrollTop;
    }
  }

  function scrollToStoredVerticalPosition() {
    const { current } = viewerRef;
    if (current) {
      current.scrollTo({ top: currentTopPosition });
    }
  }

  function scrollToTop() {
    const { current } = viewerRef;
    if (current) {
      current.scrollTo({ top: 0 });
    }
  }
}
