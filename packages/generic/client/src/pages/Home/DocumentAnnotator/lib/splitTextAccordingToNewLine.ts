import { flattenDeep } from 'lodash';

export { splitTextAccordingToNewLine };

function splitTextAccordingToNewLine(text: string): string[] {
  return flattenDeep(
    text.split('\r\n').map((splitText) => splitText.split('\r').map((splitText) => splitText.split('\n'))),
  );
}
