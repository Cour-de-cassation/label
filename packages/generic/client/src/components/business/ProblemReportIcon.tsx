import React from 'react';
import { problemReportType } from '@label/core';
import { useCustomTheme, CircleIcon, iconNameType } from 'pelta-design-system';
import { wordings } from '../../wordings';

export { ProblemReportIcon };

const problemReportTypeIconNameMapping: Record<
  problemReportType['type'],
  { iconName: iconNameType; colorName: 'warning' | 'alert' | 'success' }
> = {
  bug: { iconName: 'bug', colorName: 'alert' },
  annotationProblem: { iconName: 'discussion', colorName: 'warning' },
  suggestion: { iconName: 'lightBulb', colorName: 'success' },
};

function ProblemReportIcon(props: { iconSize: number; type: problemReportType['type'] }) {
  const theme = useCustomTheme();
  const { iconName } = problemReportTypeIconNameMapping[props.type];

  return (
    <CircleIcon
      hint={wordings.business.problemReportType[props.type]}
      iconName={iconName}
      iconSize={props.iconSize}
      backgroundColor={theme.colors[problemReportTypeIconNameMapping[props.type].colorName].background}
    />
  );
}
