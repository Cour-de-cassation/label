import { handleFetchedData } from './handleFetchedData';

describe('handleFetchedData', () => {
  it('should return loading if refetching', () => {
    const fetchedInfo = {
      data: { content: 'notEmpty' },
      isLoaded: false,
    };
    const showLoadingOnRefetch = true;

    const fetchedData = handleFetchedData(fetchedInfo, showLoadingOnRefetch);

    expect(fetchedData).toEqual({ kind: 'loading' });
  });

  it('should return loading if actually loading', () => {
    const fetchedInfo = {
      isLoaded: false,
    };
    const showLoadingOnRefetch = false;

    const fetchedData = handleFetchedData(fetchedInfo, showLoadingOnRefetch);

    expect(fetchedData).toEqual({ kind: 'loading' });
  });

  it('should return a generic error', () => {
    const fetchedInfo = {
      data: { content: 'notEmpty' },
      isLoaded: true,
      statusCode: 404,
    };
    const showLoadingOnRefetch = true;

    const fetchedData = handleFetchedData(fetchedInfo, showLoadingOnRefetch);

    expect(fetchedData).toEqual({ kind: 'error', error: 'unknown' });
  });

  it('should return an unknown error', () => {
    const fetchedInfo = {
      data: { content: 'notEmpty' },
      isLoaded: true,
      statusCode: 401,
    };
    const showLoadingOnRefetch = true;

    const fetchedData = handleFetchedData(fetchedInfo, showLoadingOnRefetch);

    expect(fetchedData).toEqual({ kind: 'error', error: 'unknown' });
  });

  it('should return the fetched data', () => {
    const fetchedInfo = {
      data: { content: 'notEmpty' },
      isLoaded: true,
      statusCode: 201,
    };
    const showLoadingOnRefetch = false;

    const fetchedData = handleFetchedData(fetchedInfo, showLoadingOnRefetch);

    expect(fetchedData).toEqual({ kind: 'data', data: { content: 'notEmpty' } });
  });

  it('should return the fetched data even when loading', () => {
    const fetchedInfo = {
      data: { content: 'notEmpty' },
      isLoaded: false,
    };
    const showLoadingOnRefetch = false;

    const fetchedData = handleFetchedData(fetchedInfo, showLoadingOnRefetch);

    expect(fetchedData).toEqual({ kind: 'data', data: { content: 'notEmpty' } });
  });
});
