export { indexer };

const indexer = {
  assertEveryIdIsDefined,
  indexBy,
  indexManyBy,
  mapIndexBy,
};

function indexBy<T>(datas: Array<T>, indexFun: (data: T) => string): { [index: string]: T } {
  const indexedDatas: { [index: string]: T } = {};

  datas.forEach((data) => (indexedDatas[indexFun(data)] = data));

  return indexedDatas;
}

function mapIndexBy<T, U>(
  datas: Array<T>,
  indexFun: (data: T) => string,
  mapper: (data: T) => U,
): { [index: string]: U } {
  const indexedDatas: { [index: string]: U } = {};

  datas.forEach((data) => (indexedDatas[indexFun(data)] = mapper(data)));

  return indexedDatas;
}

function indexManyBy<T>(datas: Array<T>, indexFun: (data: T) => string): { [index: string]: Array<T> } {
  const indexedDatas: { [index: string]: Array<T> } = {};

  datas.forEach((data) => {
    const index = indexFun(data);

    if (!indexedDatas[index]) {
      indexedDatas[index] = [];
    }

    indexedDatas[index].push(data);
  });

  return indexedDatas;
}

function assertEveryIdIsDefined<T>(
  ids: string[],
  itemsById: Record<string, T>,
  buildErrorDescription: (_id: string) => string,
) {
  const idWithNoItem = ids.find((_id) => !itemsById[_id]);
  if (idWithNoItem) {
    throw new Error(buildErrorDescription(idWithNoItem));
  }
}
