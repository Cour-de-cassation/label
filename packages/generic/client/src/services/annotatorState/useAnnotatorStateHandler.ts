import { useContext } from 'react';
import { AnnotatorStateHandlerContext } from './AnnotatorStateHandlerContextProvider';

export { useAnnotatorStateHandler };

function useAnnotatorStateHandler() {
  return useContext(AnnotatorStateHandlerContext);
}
