import { publicationHandler } from './publicationHandler';

describe('publicationHandler', () => {
  it('should mustBePublished return true because of publicationCategory', () => {
    const publicationCategory = ['P', 'B'];
    const NACCode = '99A';
    const selection = false;

    const mustBePublished = publicationHandler.mustBePublished(publicationCategory, selection, NACCode);

    expect(mustBePublished).toEqual(true);
  });

  it('should mustBePublished return true because of NACCode', () => {
    const publicationCategory = ['W'];
    const NACCode = '97H';
    const selection = false;

    const mustBePublished = publicationHandler.mustBePublished(publicationCategory, selection, NACCode);

    expect(mustBePublished).toEqual(true);
  });

  it('should mustBePublished return true because of selection', () => {
    const publicationCategory = ['W'];
    const NACCode = '97H';
    const selection = true;

    const mustBePublished = publicationHandler.mustBePublished(publicationCategory, selection, NACCode);

    expect(mustBePublished).toEqual(true);
  });

  it('should mustBePublished return false', () => {
    const publicationCategory = ['W'];
    const NACCode = '99A';
    const selection = false;

    const mustBePublished = publicationHandler.mustBePublished(publicationCategory, selection, NACCode);

    expect(mustBePublished).toEqual(false);
  });
});
