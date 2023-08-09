import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { annotationsDiffType, fetchedDocumentType, settingsModule, settingsType } from '@label/core';
import { apiCaller } from '../../../api';
import { MainHeader } from '../../../components';
import {
  AnnotatorStateHandlerContextProvider,
  buildAnnotationsCommitter,
  buildAutoSaver,
} from '../../../services/annotatorState';
import { DocumentAnnotator } from '../../Home/DocumentAnnotator';
import { useAlert } from '../../../services/alert';
import { wordings } from '../../../wordings';
import { AnnotationsDataFetcher } from './AnnotationsDataFetcher';
import { DocumentDataFetcher } from './DocumentDataFetcher';
import { localStorage } from '../../../services/localStorage';
import { MandatoryReplacementTermsDataFetcher } from './MandatoryReplacementTermsDataFetcher';

export { DocumentInspector };

type DocumentInspectorParamsType = {
  documentId: string;
};

function DocumentInspector(props: { settings: settingsType }) {
  const params = useParams<DocumentInspectorParamsType>();
  const history = useHistory();
  const { displayAlert } = useAlert();

  useEffect(() => {
    const userRole = localStorage.userHandler.getRole();
    if (userRole === 'scrutator') {
      displayScrutatorInfo();
    }
  }, []);

  return (
    <DocumentDataFetcher documentId={params.documentId}>
      {({ document }) => (
        <MandatoryReplacementTermsDataFetcher documentId={params.documentId}>
          {({ mandatoryReplacementTerms }) => (
            <AnnotationsDataFetcher documentId={params.documentId}>
              {({ annotations }) => {
                const settingsForDocument = settingsModule.lib.computeFilteredSettings(
                  props.settings,
                  document.decisionMetadata.categoriesToOmit,
                  document.decisionMetadata.additionalTermsToAnnotate,
                );

                const applyAutoSave = buildApplyAutoSave(document._id);

                return (
                  <AnnotatorStateHandlerContextProvider
                    autoSaver={buildAutoSaver({ applySave: applyAutoSave })}
                    committer={buildAnnotationsCommitter()}
                    initialAnnotatorState={{
                      annotations: annotations,
                      document: document,
                      settings: settingsForDocument,
                      mandatoryReplacementTerms: mandatoryReplacementTerms,
                    }}
                  >
                    <MainHeader title={document.title} onBackButtonPress={history.goBack} />
                    <DocumentAnnotator onStopAnnotatingDocument={buildOnStopAnnotatingDocument(document)} />
                  </AnnotatorStateHandlerContextProvider>
                );
              }}
            </AnnotationsDataFetcher>
          )}
        </MandatoryReplacementTermsDataFetcher>
      )}
    </DocumentDataFetcher>
  );

  function buildOnStopAnnotatingDocument(document: fetchedDocumentType) {
    if (document.route !== 'confirmation' && document.route !== 'request') {
      return undefined;
    }

    return async () => {
      history.goBack();
    };
  }

  function displayScrutatorInfo() {
    displayAlert({ variant: 'info', text: wordings.homePage.scrutatorInfo, autoHide: true });
  }

  function buildApplyAutoSave(documentId: fetchedDocumentType['_id']) {
    return applyAutoSave;

    async function applyAutoSave(annotationsDiff: annotationsDiffType) {
      try {
        await apiCaller.post<'updateTreatmentForDocumentId'>('updateTreatmentForDocumentId', {
          annotationsDiff,
          documentId,
        });
      } catch (error) {
        displayAlert({ variant: 'alert', text: wordings.business.errors.updateTreatmentFailed, autoHide: true });
        console.warn(error);
      }
    }
  }
}
