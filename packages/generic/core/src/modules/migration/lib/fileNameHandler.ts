import { idModule, idType } from '../../../modules/id';

export { fileNameHandler };

const fileNameHandler = {
  buildFileName,
  parseFileName,
  sortFileNames,
};

function buildFileName({ _id, order, extension }: { _id: idType; order: number; extension: 'ts' | 'js' }) {
  return `${order}_${idModule.lib.convertToString(_id)}.${extension}`;
}

function sortFileNames(fileNames: string[], direction: 'asc' | 'desc') {
  return [...fileNames].sort((fileName1, fileName2) => {
    const { order: order1 } = parseFileName(fileName1);
    const { order: order2 } = parseFileName(fileName2);
    switch (direction) {
      case 'asc':
        return order1 - order2;
      case 'desc':
        return order2 - order1;
    }
  });
}

function parseFileName(fileName: string) {
  const FILENAME_REGEX = /([0-9]+)_([a-f\d]{24})\.(ts|js)/;
  const result = fileName.match(FILENAME_REGEX);
  if (!result || !result[1] || !result[2]) {
    throw new Error(`Wrong format for migration filename : ${fileName}`);
  }
  const order = Number(result[1]);
  const _id = idModule.lib.buildId(result[2]);

  return { _id, order };
}
