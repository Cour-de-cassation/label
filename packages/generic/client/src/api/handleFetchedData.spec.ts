import { httpStatusCodeHandler } from '@label/core';
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
      statusCode: httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.NOT_FOUND_ERROR,
    };
    const showLoadingOnRefetch = true;

    const fetchedData = handleFetchedData(fetchedInfo, showLoadingOnRefetch);

    expect(fetchedData).toEqual({ kind: 'error', error: 'unknown' });
  });

  it('should return an authentication error', () => {
    const fetchedInfo = {
      data: { content: 'notEmpty' },
      isLoaded: true,
      statusCode: httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.AUTHENTICATION_ERROR,
    };
    const showLoadingOnRefetch = true;

    const fetchedData = handleFetchedData(fetchedInfo, showLoadingOnRefetch);

    expect(fetchedData).toEqual({ kind: 'error', error: 'authentication' });
  });

  it('should return the fetched data', () => {
    const fetchedInfo = {
      data: { content: 'notEmpty' },
      isLoaded: true,
      statusCode: httpStatusCodeHandler.HTTP_STATUS_CODE.SUCCESS.CREATED,
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
