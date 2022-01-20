import React from 'react';
import { IconButton } from 'pelta-design-system';
import { useAnnotatorStateHandler } from '../../../services/annotatorState';
import { useAnonymizerBuilder } from '../../../services/anonymizer';
import { wordings } from '../../../wordings';

export { CopyAnonymizedTextButton };

function CopyAnonymizedTextButton() {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const annotatorState = annotatorStateHandler.get();
  const anonymizerBuilder = useAnonymizerBuilder();

  const anonymizer = anonymizerBuilder.get();

  return <IconButton iconName="copy" onClick={copyToClipboard} hint={wordings.shared.copyToClipboard} />;

  async function copyToClipboard() {
    const anonymizedDocument = anonymizer.anonymizeDocument(annotatorState.document);
    await navigator.clipboard.writeText(anonymizedDocument.text);
  }
}
