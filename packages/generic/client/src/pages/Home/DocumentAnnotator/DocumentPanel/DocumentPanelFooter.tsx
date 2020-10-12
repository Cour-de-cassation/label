import React from 'react';
import { heights } from '../../../../styles';
import { LayoutGrid } from '../../../../components';

export { DocumentPanelFooter };

function DocumentPanelFooter() {
  const styles = buildStyles();
  return (
    <LayoutGrid style={styles.container}>
      <div />
    </LayoutGrid>
  );

  function buildStyles() {
    return {
      container: {
        height: heights.panelFooter,
      },
    };
  }
}
