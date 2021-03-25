export { indexer };

const indexer = {
  indexBy,
  indexManyBy,
};

function indexBy<T>(datas: Array<T>, indexFun: (data: T) => string): { [index: string]: T } {
  const indexedDatas: { [index: string]: T } = {};

  datas.forEach((data) => (indexedDatas[indexFun(data)] = data));

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
