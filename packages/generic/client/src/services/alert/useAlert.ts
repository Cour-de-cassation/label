import { useContext } from 'react';
import { AlertHandlerContext } from './AlertHandler';

export { useAlert };

function useAlert() {
  return useContext(AlertHandlerContext);
}
