import { useEffect, useState } from 'react';
import { CustomError } from '@label/core';

export { useApi };

function useApi<T>(callApi: () => Promise<{ data: T; statusCode: number }>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number | undefined>(undefined);
  const [refetchFlag, setRefetchFlag] = useState<boolean>(false);

  useEffect(() => {
    callApi().then(
      ({ data, statusCode }) => {
        setData(data);
        setIsLoaded(true);
        setStatusCode(statusCode);
      },
      (error) => {
        setIsLoaded(true);
        if (error instanceof CustomError) {
          setStatusCode(error.statusCode);
        } else {
          setStatusCode(500);
        }
      },
    );
  }, [refetchFlag]);

  return { data, isLoaded, refetch, statusCode };

  function refetch() {
    setIsLoaded(false);
    setStatusCode(undefined);
    setRefetchFlag(!refetchFlag);
  }
}
