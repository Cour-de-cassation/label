import React from 'react';
import { LoopRounded, SendRounded, SaveAltRounded, RedoRounded, UndoRounded } from '@material-ui/icons';

export { Icon };
export type { iconNameType };

const materialIconMapping = {
  redo: RedoRounded,
  reset: LoopRounded,
  send: SendRounded,
  save: SaveAltRounded,
  undo: UndoRounded,
};

type iconNameType = keyof typeof materialIconMapping;

function Icon(props: { iconName: iconNameType }) {
  const IconComponent = materialIconMapping[props.iconName];
  return <IconComponent />;
}
