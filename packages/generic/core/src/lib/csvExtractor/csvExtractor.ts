export { csvExtractor };

const csvExtractor = {
  convertDataToCsv,
};

const DELIMITATOR_CHARACTER = ';';

function convertDataToCsv<DataT>(
  data: Array<DataT>,
  fields: Array<{ title: string; extractor: (data: DataT) => string | number }>,
) {
  return [
    fields.map((field) => field.title).join(DELIMITATOR_CHARACTER),
    ...data.map((row) => {
      return fields.map((field) => field.extractor(row)).join(DELIMITATOR_CHARACTER);
    }),
  ].join('\n');
}
