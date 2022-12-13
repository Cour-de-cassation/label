import React from 'react';
import { customThemeType, useCustomTheme, Text } from 'pelta-design-system';
import { wordings } from '../../../../wordings';

export { SummaryBox };

export type { summaryType };

const ROW_HEIGHT = 30;

type summaryType = {
  loadedDocuments: number;
  nlpAnnotatingDocuments: number;
  freeDocuments: number;
  pendingDocuments: number;
  savedDocuments: number;
  doneDocuments: number;
  lockedDocuments: number;
  rejectedDocuments: number;
};

function SummaryBox(props: { summary: summaryType; width: number }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const summaryRows = buildSummaryRow();
  return (
    <div style={styles.container}>
      <div style={styles.rowsContainer}>
        {summaryRows.map((summaryRow) => (
          <div style={styles.rowContainer}>
            <Text>{summaryRow.label}</Text>
            <Text>{summaryRow.value}</Text>
          </div>
        ))}
      </div>
    </div>
  );

  function buildSummaryRow() {
    const { summary } = props;

    return [
      {
        label: wordings.summaryPage.box.fields.loadedDocuments,
        value: summary.loadedDocuments,
      },
      {
        label: wordings.summaryPage.box.fields.nlpAnnotatingDocuments,
        value: summary.nlpAnnotatingDocuments,
      },
      {
        label: wordings.summaryPage.box.fields.freeDocuments,
        value: summary.freeDocuments,
      },
      {
        label: wordings.summaryPage.box.fields.pendingDocuments,
        value: summary.pendingDocuments,
      },
      {
        label: wordings.summaryPage.box.fields.savedDocuments,
        value: summary.savedDocuments,
      },
      {
        label: wordings.summaryPage.box.fields.doneDocuments,
        value: summary.doneDocuments,
      },
      {
        label: wordings.summaryPage.box.fields.lockedDocuments,
        value: summary.lockedDocuments,
      },
      {
        label: wordings.summaryPage.box.fields.rejectedDocuments,
        value: summary.rejectedDocuments,
      },
    ];
  }

  function buildStyles(theme: customThemeType) {
    return {
      container: {
        width: `${props.width}px`,
        borderRadius: theme.shape.borderRadius.s,
        padding: theme.spacing * 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: theme.boxShadow.minor.out,
      },
      rowsContainer: {
        width: '100%',
      },
      rowContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        height: ROW_HEIGHT,
        alignItems: 'center',
      },
    } as const;
  }
}
