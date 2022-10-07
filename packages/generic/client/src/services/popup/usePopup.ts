import { useContext } from 'react';
import { PopupHandlerContext } from './PopupHandler';

export { usePopup };

function usePopup() {
  return useContext(PopupHandlerContext);
}
