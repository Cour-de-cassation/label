import { promises as fs } from 'fs';
import { logger } from '../logger';

export { fileSystem };

const fileSystem = { appendToFile, listFilesOfDirectory, readFiles };

async function appendToFile(filePath: string, text: string) {
  try {
    await fs.appendFile(filePath, text);
    return;
  } catch (error) {
    logger.error(error);
    throw new Error(`Could not write in file ${filePath}`);
  }
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
