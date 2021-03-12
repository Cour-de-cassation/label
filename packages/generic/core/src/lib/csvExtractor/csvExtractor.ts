export { csvExtractor };

const csvExtractor = {
  convertDataToCsv,
};

function convertDataToCsv<DataT>(
  data: Array<DataT>,
  fields: Array<{ title: string; extractor: (data: DataT) => string | number }>,
) {
  return [
    fields.map((field) => field.title).join('\t'),
    ...data.map((row) => {
      return fields.map((field) => field.extractor(row)).join('\t');
    }),
  ].join('\n');
}
