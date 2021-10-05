import React from 'react';

export { buildViewerScrollerHandler };

export type { viewerScrollerHandlerHandlerType };

type viewerScrollerHandlerHandlerType = {
  getViewerRef: () => React.MutableRefObject<HTMLDivElement | null>;
  getCurrentVerticalPosition: () => number;
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
    getCurrentVerticalPosition,
    storeCurrentVerticalPosition,
    scrollToStoredVerticalPosition,
    scrollToTop,
  };

  function getViewerRef() {
    return viewerRef;
  }

  function getCurrentVerticalPosition() {
    const { current } = viewerRef;
    if (current) {
      return current.scrollTop;
    }
    return 0;
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
