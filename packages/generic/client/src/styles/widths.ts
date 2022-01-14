export { widths };

const widths = buildWidths();

function buildWidths() {
  const ANNOTATIONS_PANEL_WIDTH = '37vw';
  const DOCUMENT_PANEL_WIDTH = `calc(100vw - ${ANNOTATIONS_PANEL_WIDTH} )`;
  const ADMIN_MENU_WIDTH = '65px';
  const ADMIN_CONTENT_WIDTH = `calc(100vw - ${ADMIN_MENU_WIDTH})`;
  return {
    annotationsPanel: ANNOTATIONS_PANEL_WIDTH,
    documentPanel: DOCUMENT_PANEL_WIDTH,
    adminMenu: ADMIN_MENU_WIDTH,
    adminContent: ADMIN_CONTENT_WIDTH,
  };
}
