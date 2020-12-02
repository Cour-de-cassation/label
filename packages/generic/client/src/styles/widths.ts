export { widths };

const widths = buildWidths();

function buildWidths() {
  const ANNOTATIONS_PANEL_WIDTH = '33vw';
  const DOCUMENT_PANEL_WIDTH = `calc(100vw - ${ANNOTATIONS_PANEL_WIDTH} )`;

  return {
    annotationsPanel: ANNOTATIONS_PANEL_WIDTH,
    documentPanel: DOCUMENT_PANEL_WIDTH,
  };
}
