import React from 'react';
import { wordings } from '../../../../wordings';
import { IconButton } from '../IconButton';

export { OptionButton };

function OptionButton(props: { onClick: () => void }) {
  return <IconButton color="default" iconName="more" onClick={props.onClick} hint={wordings.shared.moreOptions} />;
}
