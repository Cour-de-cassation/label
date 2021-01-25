import React, { ReactElement } from 'react';
import { wordings } from '../../../../wordings';
import { IconDropdown } from '../IconDropdown';

export { OptionButton };

function OptionButton<T extends string>(props: {
  items: Array<{ icon?: ReactElement; text: string; value: T }>;
  onSelect: (value: T) => void;
}) {
  return (
    <IconDropdown hint={wordings.shared.moreOptions} items={props.items} iconName="more" onChange={props.onSelect} />
  );
}
