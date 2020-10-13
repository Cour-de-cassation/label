import React from 'react';
import { heights } from '../../../../styles';
import { Button, LayoutGrid } from '../../../../components';
import { wordings } from '../../../../wordings';

export { DocumentPanelFooter };

function DocumentPanelFooter() {
  const styles = buildStyles();
  return (
    <LayoutGrid container style={styles.container} justifyContent="space-between" alignItems="center">
      <LayoutGrid item>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Button onClick={() => {}} color="default">
          {wordings.reset}
        </Button>
      </LayoutGrid>
      <LayoutGrid item>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Button onClick={() => {}} color="default">
          {wordings.saveDraft}
        </Button>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <Button onClick={() => {}} color="primary">
          {wordings.validate}
        </Button>
      </LayoutGrid>
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
