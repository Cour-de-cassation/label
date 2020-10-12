export { heights };

const heights = buildHeights();

function buildHeights() {
  const HEADER_HEIGHT = '50px';
  const PANEL_HEADER_HEIGHT = '50px';
  const PANEL_FOOTER_HEIGHT = '100px';
  const PANEL_HEIGHT = `calc(100vh - ${HEADER_HEIGHT} - ${PANEL_FOOTER_HEIGHT} - ${PANEL_HEADER_HEIGHT})`;

  return {
    panelHeader: PANEL_HEADER_HEIGHT,
    header: HEADER_HEIGHT,
    panel: PANEL_HEIGHT,
    panelFooter: PANEL_FOOTER_HEIGHT,
  };
}
