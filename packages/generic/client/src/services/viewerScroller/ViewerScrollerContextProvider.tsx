import React, { createContext, ReactElement, useMemo } from 'react';
import { buildViewerScrollerHandler, viewerScrollerHandlerHandlerType } from './buildViewerScrollerHandler';

export { ViewerScrollerContext, ViewerScrollerContextProvider };

const ViewerScrollerContext = createContext<viewerScrollerHandlerHandlerType>({
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-return */
  getViewerRef: () => null as any,
  getCurrentVerticalPosition: () => 0,
  storeCurrentVerticalPosition: () => null,
  scrollToStoredVerticalPosition: () => null,
  scrollToTop: () => null,
});

function ViewerScrollerContextProvider(props: {
  viewerRef: React.MutableRefObject<HTMLDivElement | null>;
  children: ReactElement;
}): ReactElement {
  const viewerScrollerHandler = useMemo(() => buildViewerScrollerHandler(props.viewerRef), []);

  return (
    <ViewerScrollerContext.Provider value={viewerScrollerHandler}>{props.children}</ViewerScrollerContext.Provider>
  );
}
