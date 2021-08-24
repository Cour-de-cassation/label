import { useContext } from 'react';
import { AnonymizerBuilderContext } from './AnonymizerBuilderContextProvider';

export { useAnonymizerBuilder };

function useAnonymizerBuilder() {
  return useContext(AnonymizerBuilderContext);
}
