import React from 'react';
import { documentType } from '@label/core';
import { useCustomTheme } from '../../styles';
import { wordings } from '../../wordings';
import { CircleIcon, iconNameType } from '../generic';

export { DocumentStatusIcon };

const documentStatusIconNameMapping: Record<
  documentType['status'],
  { iconName: iconNameType; colorName: 'alert' | 'primary' }
> = {
  loaded: { iconName: 'waiting', colorName: 'primary' },
  nlpAnnotating: { iconName: 'waiting', colorName: 'primary' },
  free: { iconName: 'waiting', colorName: 'primary' },
  pending: { iconName: 'assigned', colorName: 'primary' },
  saved: { iconName: 'update', colorName: 'primary' },
  toBePublished: { iconName: 'publish', colorName: 'primary' },
  done: { iconName: 'check', colorName: 'primary' },
  toBeConfirmed: { iconName: 'checkBox', colorName: 'primary' },
  rejected: { iconName: 'stop', colorName: 'alert' },
};

function DocumentStatusIcon(props: { iconSize: number; status: documentType['status'] }) {
  const theme = useCustomTheme();
  const { colorName, iconName } = documentStatusIconNameMapping[props.status];

  return (
    <CircleIcon
      hint={wordings.business.documentStatus[props.status]}
      iconName={iconName}
      iconSize={props.iconSize}
      backgroundColor={theme.colors[colorName].background}
    />
  );
}
