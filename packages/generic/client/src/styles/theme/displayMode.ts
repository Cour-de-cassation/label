import { createContext, useContext } from 'react';

export { useDisplayMode, DisplayModeContext };

export type { displayModeType };

type displayModeType = 'light' | 'dark';

const DisplayModeContext = createContext<{
  displayMode: displayModeType;
  setDisplayMode: (displayMode: displayModeType) => void;
}>({
  displayMode: 'dark',
  setDisplayMode: () => null,
});

const useDisplayMode = () => {
  return useContext(DisplayModeContext);
};
