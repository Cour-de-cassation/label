import { promises as fs } from 'fs';

export { fileSystem };

const fileSystem = { listFilesOfDirectory, readFiles };

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
  const fileContents: Array<string> = [];

  for await (const fileName of fileNames) {
    fileContents.push(
      await fs.readFile(`${basePath}${fileName}`, {
        encoding,
      }),
    );
  }

  return fileContents;
}
