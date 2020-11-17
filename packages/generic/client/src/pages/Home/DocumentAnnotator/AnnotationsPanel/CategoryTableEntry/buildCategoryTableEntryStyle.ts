import { customThemeType } from '../../../../../styles';

export { buildCategoryTableEntryStyle };

function buildCategoryTableEntryStyle(theme: customThemeType) {
  return {
    anonymizedText: {
      fontStyle: 'italic',
    },
    occurencesNumber: {
      textAlign: 'right',
      paddingRight: theme.spacing * 3,
    },
    textCell: {
      padding: `${theme.spacing}px 0`,
    },
  } as const;
}
