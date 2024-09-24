import { promises as fs } from 'fs';

export { fileSystem };

const fileSystem = {
  appendToFile,
  createFile,
  listFilesOfDirectory,
  readFiles,
};

async function appendToFile(filePath: string, text: string) {
  return fs.appendFile(filePath, text);
}

async function createFile(filePath: string, text: string) {
  return fs.writeFile(filePath, text);
}

async function listFilesOfDirectory(directoryPath: string) {
  const directory = await fs.opendir(directoryPath);

  const fileNames: Array<string> = [];
  for await (const entry of directory) {
    if (entry.isFile()) {
      fileNames.push(entry.name);
    }
  }

  return fileNames;
}

async function readFiles(
  fileNames: Array<string>,
  encoding: 'utf8' | 'latin1',
  basePath?: string,
) {
  const fileContents: Array<{ fileName: string; content: string }> = [];

  for await (const fileName of fileNames) {
    fileContents.push({
      fileName,
      content: await fs.readFile(`${basePath}${fileName}`, {
        encoding,
      }),
    });
  }

  return fileContents;
}
