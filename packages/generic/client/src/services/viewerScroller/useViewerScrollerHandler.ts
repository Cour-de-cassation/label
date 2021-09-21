import { useContext } from 'react';
import { ViewerScrollerContext } from './ViewerScrollerContextProvider';

export { useViewerScrollerHandler };

function useViewerScrollerHandler() {
  return useContext(ViewerScrollerContext);
}
