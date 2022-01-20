import { heights as peltaHeights } from 'pelta-design-system';

export { heights };

const heights = buildHeights();

function buildHeights() {
  const ANNOTATOR_PANEL_HEADER_HEIGHT = '72px';
  const ANNOTATOR_PANEL_FOOTER_HEIGHT = '72px';
  const ANNOTATOR_PANEL_HEIGHT = `calc(100vh - ${peltaHeights.header} - ${ANNOTATOR_PANEL_FOOTER_HEIGHT} - ${ANNOTATOR_PANEL_HEADER_HEIGHT})`;
  const ADMIN_TREATMENTS_TABLE_HEADER_HEIGHT = '140px';
  const ADMIN_TREATMENTS_TABLE_HEIGHT = `calc(100vh - ${peltaHeights.header} - ${ADMIN_TREATMENTS_TABLE_HEADER_HEIGHT})`;
  const PUBLISHABLE_DOCUMENTS_TABLE_HEADER_HEIGHT = '72px';
  const PUBLISHABLE_DOCUMENTS_TABLE_HEIGHT = `calc(100vh - ${peltaHeights.header} - ${PUBLISHABLE_DOCUMENTS_TABLE_HEADER_HEIGHT})`;
  const PUBLISHABLE_DOCUMENTS_HEIGHT = `calc(100vh - ${peltaHeights.header})`;
  const STATISTICS_HEADER_HEIGHT = '72px';
  const STATISTICS_BODY_HEIGHT = `calc(100vh - ${peltaHeights.header} - ${STATISTICS_HEADER_HEIGHT})`;
  const ANONYMIZED_DOCUMENT_HEADER_HEIGHT = '72px';
  const ANONYMIZED_DOCUMENT_FOOTER_HEIGHT = '72px';
  const ANONYMIZED_DOCUMENT_HEIGHT = `calc(100vh - ${peltaHeights.header} - ${ANONYMIZED_DOCUMENT_HEADER_HEIGHT} - ${ANONYMIZED_DOCUMENT_FOOTER_HEIGHT})`;

  return {
    header: peltaHeights.header,
    annotatorPanelHeader: ANNOTATOR_PANEL_HEADER_HEIGHT,
    annotatorPanel: ANNOTATOR_PANEL_HEIGHT,
    annotatorPanelFooter: ANNOTATOR_PANEL_FOOTER_HEIGHT,
    anonymizedDocumentHeader: ANONYMIZED_DOCUMENT_HEADER_HEIGHT,
    anonymizedDocument: ANONYMIZED_DOCUMENT_HEIGHT,
    anonymizedDocumentFooter: ANONYMIZED_DOCUMENT_FOOTER_HEIGHT,
    adminPanel: peltaHeights.adminPanel,
    adminTreatmentsTableHeader: ADMIN_TREATMENTS_TABLE_HEADER_HEIGHT,
    adminTreatmentsTable: ADMIN_TREATMENTS_TABLE_HEIGHT,
    publishableDocuments: PUBLISHABLE_DOCUMENTS_HEIGHT,
    publishableDocumentsTableHeader: PUBLISHABLE_DOCUMENTS_TABLE_HEADER_HEIGHT,
    publishableDocumentsTable: PUBLISHABLE_DOCUMENTS_TABLE_HEIGHT,
    statisticsHeaderHeight: STATISTICS_HEADER_HEIGHT,
    statisticsBodyHeight: STATISTICS_BODY_HEIGHT,
  };
}
