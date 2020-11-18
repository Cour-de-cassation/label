import { createContext, useContext } from 'react';
import { displayModeType } from '@label/core';

export { useDisplayMode, DisplayModeContext };

const DisplayModeContext = createContext<{
  displayMode: displayModeType;
  setDisplayMode: (displayMode: displayModeType) => void;
}>({
  displayMode: 'darkMode',
  setDisplayMode: () => null,
});

const useDisplayMode = () => {
  return useContext(DisplayModeContext);
};
