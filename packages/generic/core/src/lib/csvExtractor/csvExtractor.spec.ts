import { csvExtractor } from './csvExtractor';

describe('csvExtractor', () => {
  it('should extract in the right format', () => {
    const data = [
      { user: { name: 'Nicolas', birthDate: '25/04/2001' } },
      { user: { name: 'Benoit', birthDate: '17/01/2002' } },
    ];
    const fields = [
      {
        title: 'name',
        extractor: (data) => data.user.name,
      },
      {
        title: 'birthDate',
        extractor: (data) => data.user.birthDate,
      },
    ] as Array<{ title: string; extractor: (data: { user: { name: string; birthDate: string } }) => string }>;

    const CSV = csvExtractor.convertDataToCsv(data, fields);

    expect(CSV).toBe('name;birthDate\nNicolas;25/04/2001\nBenoit;17/01/2002');
  });
});
