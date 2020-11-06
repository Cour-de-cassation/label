import { useContext } from 'react';
import { DisplayModeContext } from './ThemeProvider';

export { useDisplayMode };

const useDisplayMode = () => {
  return useContext(DisplayModeContext);
};
