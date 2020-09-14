import { promises as fs } from 'fs';
import { converter } from '../lib/converter';

const courtDecisionFolderPath = './tmp/xmlCourtDecisions/';
const plainTextCourtDecisionFolderPath = './tmp/plainTextCourtDecisions/';

convertCourtDecisionsFromXmlToPlainText();

async function convertCourtDecisionsFromXmlToPlainText() {
  console.log('Begin the convertion');

  const courtDecisionFileNames = await getCourtDecisionFileNames();
  console.log(`Files to convert ${courtDecisionFileNames}`);

  await fs.mkdir(plainTextCourtDecisionFolderPath);

  for (const ind in courtDecisionFileNames) {
    await convertCourtDecisionFromXmlToPlainText(courtDecisionFileNames[ind]);
  }
}

async function getCourtDecisionFileNames() {
  const directory = await fs.opendir(courtDecisionFolderPath);
  const courtDecisionFileNames: Array<string> = [];

  for await (const entry of directory) {
    if (entry.isFile()) {
      courtDecisionFileNames.push(entry.name);
    }
  }

  return courtDecisionFileNames;
}

async function convertCourtDecisionFromXmlToPlainText(
  courtDecisionFileName: string,
) {
  console.log(`Converting ${courtDecisionFolderPath}${courtDecisionFileName}`);
  const xmlCourtDecision = await fs.readFile(
    `${courtDecisionFolderPath}${courtDecisionFileName}`,
    {
      encoding: 'latin1',
    },
  );
  const parsedCourtDecision = converter.convertFromXml(xmlCourtDecision);
  const plainTextCourtDecision = parsedCourtDecision.text;
  const newCourtDecisionFileName = `${courtDecisionFileName.slice(
    0,
    courtDecisionFileName.length - 3,
  )}txt`;
  await fs.writeFile(
    `${plainTextCourtDecisionFolderPath}${newCourtDecisionFileName}`,
    plainTextCourtDecision,
    'latin1',
  );
  console.log(`Done with ${courtDecisionFolderPath}${courtDecisionFileName}`);
}
