import { useEffect, useState } from 'react';

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
      () => {
        setIsLoaded(true);
        setStatusCode(500);
      },
    );
  }, [refetchFlag]);

  return { data, isLoaded, refetch, statusCode };

  function refetch() {
    setData(undefined);
    setIsLoaded(false);
    setStatusCode(undefined);
    setRefetchFlag(!refetchFlag);
  }
}
