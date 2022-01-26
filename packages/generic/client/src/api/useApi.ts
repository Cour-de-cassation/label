import { useEffect, useState } from 'react';
import { CustomError } from 'sder-core';

export { useApi };

function useApi<dataT, paramsT>(
  callApi: (params: paramsT) => Promise<{ data: dataT; statusCode: number }>,
  initialParams: paramsT,
) {
  const [data, setData] = useState<dataT | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number | undefined>(undefined);
  const [refetchFlag, setRefetchFlag] = useState<boolean>(false);
  const [params, setParams] = useState<paramsT>(initialParams);

  useEffect(() => {
    callApi(params).then(
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

  return { data, params, isLoaded, refetch, statusCode };

  function refetch(params?: paramsT) {
    if (params) {
      setParams(params);
    }
    setIsLoaded(false);
    setStatusCode(undefined);
    setRefetchFlag(!refetchFlag);
  }
}
