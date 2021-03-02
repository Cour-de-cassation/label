export { heights };

const heights = buildHeights();

function buildHeights() {
  const HEADER_HEIGHT = '72px';
  const ANNOTATOR_PANEL_HEADER_HEIGHT = '72px';
  const ANNOTATOR_PANEL_FOOTER_HEIGHT = '72px';
  const ANNOTATOR_PANEL_HEIGHT = `calc(100vh - ${HEADER_HEIGHT} - ${ANNOTATOR_PANEL_FOOTER_HEIGHT} - ${ANNOTATOR_PANEL_HEADER_HEIGHT})`;
  const ADMIN_PANEL_HEIGHT = `calc(100vh - ${HEADER_HEIGHT})`;
  const ADMIN_TREATMENTS_TABLE_HEADER_HEIGHT = '140px';
  const ADMIN_TREATMENTS_TABLE_HEIGHT = `calc(100vh - ${HEADER_HEIGHT} - ${ADMIN_TREATMENTS_TABLE_HEADER_HEIGHT})`;

  return {
    annotatorPanelHeader: ANNOTATOR_PANEL_HEADER_HEIGHT,
    header: HEADER_HEIGHT,
    annotatorPanel: ANNOTATOR_PANEL_HEIGHT,
    adminPanel: ADMIN_PANEL_HEIGHT,
    adminTreatmentsTableHeader: ADMIN_TREATMENTS_TABLE_HEADER_HEIGHT,
    adminTreatmentsTable: ADMIN_TREATMENTS_TABLE_HEIGHT,
    annotatorPanelFooter: ANNOTATOR_PANEL_FOOTER_HEIGHT,
  };
}
