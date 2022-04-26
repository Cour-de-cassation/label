import { publicationHandler } from './publicationHandler';

describe('publicationHandler', () => {
  it('should mustBePublished return true because of publicationCategory', () => {
    const publicationCategory = ['P', 'B'];
    const NACCode = '99A';

    const mustBePublished = publicationHandler.mustBePublished(publicationCategory, NACCode);

    expect(mustBePublished).toEqual(true);
  });

  it('should mustBePublished return true because of NACCode', () => {
    const publicationCategory = ['W'];
    const NACCode = '97H';

    const mustBePublished = publicationHandler.mustBePublished(publicationCategory, NACCode);

    expect(mustBePublished).toEqual(true);
  });

  it('should mustBePublished return false', () => {
    const publicationCategory = ['W'];
    const NACCode = '99A';

    const mustBePublished = publicationHandler.mustBePublished(publicationCategory, NACCode);

    expect(mustBePublished).toEqual(false);
  });
});
