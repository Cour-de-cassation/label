import {
  annotationModule,
  annotationReportModule,
  annotationReportType,
  annotationType,
  documentType,
  idType,
  settingsType,
} from '@label/core';

export { buildRegexFetcher };

/* eslint-disable @typescript-eslint/no-unused-vars */
function buildRegexFetcher(settings: settingsType) {
  return {
    async fetchAnnotationOfDocument(
      settings: settingsType,
      document: documentType,
    ): Promise<{
      annotations: annotationType[];
      documentId: idType;
      report: annotationReportType;
    }> {
      const annotations: annotationType[] = [];
      const regexRule = /test/gm;
      let regexAnnotation;
      while ((regexAnnotation = regexRule.exec(document.text)) !== null) {
        annotations.push(
          annotationModule.lib.buildAnnotation({
            category: Object.keys(settings)[0],
            start: regexAnnotation.index,
            certaintyScore: 1,
            text: regexAnnotation[0],
          }),
        );
      }

      return {
        annotations: annotations,
        documentId: document._id,
        report: annotationReportModule.lib.buildAnnotationReport({
          checkList: [],
          documentId: document._id,
        }),
      };
    },
    async fetchLossOfDocument() {
      return 0;
    },
  };
}
