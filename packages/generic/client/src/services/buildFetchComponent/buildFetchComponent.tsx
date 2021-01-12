import { ReactElement } from 'react';

export { buildFetchComponent };

function buildFetchComponent<fetchedType, dataType>({
  buildComponentWithData,
  dataAdapter,
  errorPage,
  fetchInfo: { data, isLoaded, statusCode },
  loadingPage,
}: //  loginRedirect,
{
  buildComponentWithData: (returnedData: dataType) => ReactElement;
  dataAdapter: (fetchedData: fetchedType) => dataType;
  errorPage: ReactElement;
  fetchInfo: { data?: fetchedType; isLoaded: boolean; statusCode?: number };
  loadingPage: ReactElement;
  //  loginRedirect: ReactElement;
}) {
  if (!isLoaded) {
    return loadingPage;
  } else if (statusCode && statusCode > 200) {
    return errorPage;
    // TODO repair login redirection
    //    return loginRedirect;
  } else if (data) {
    const adaptedData = dataAdapter(data);
    return buildComponentWithData(adaptedData);
  } else {
    return errorPage;
  }
}
