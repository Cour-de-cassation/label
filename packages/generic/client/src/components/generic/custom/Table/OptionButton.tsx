import React, { ReactElement } from 'react';
import { wordings } from '../../../../wordings';
import { IconDropdown } from '../IconDropdown';

export { OptionButton };

function OptionButton<T extends string>(props: {
  items: Array<{ icon?: ReactElement; text: string; value: T }>;
  onSelect: (value: T) => void;
  onClose?: () => void;
}) {
  return (
    <IconDropdown
      onClose={props.onClose}
      hint={wordings.shared.moreOptions}
      items={props.items}
      iconName="moreVert"
      onChange={props.onSelect}
    />
  );
}
