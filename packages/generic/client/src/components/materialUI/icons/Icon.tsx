import React from 'react';
import {
  LoopRounded,
  SendRounded,
  SaveAltRounded,
  RedoRounded,
  UndoRounded,
  MeetingRoom,
  ExitToAppRounded,
  PersonRounded,
  BusinessRounded,
  HomeRounded,
  WorkRounded,
  ContactMailRounded,
  ReportProblemRounded,
} from '@material-ui/icons';
import { categoryIconNameType } from '@label/core/src';

export { Icon };
export type { iconNameType };

const materialIconMapping = {
  login: ExitToAppRounded,
  logout: MeetingRoom,
  redo: RedoRounded,
  reportProblem: ReportProblemRounded,
  reset: LoopRounded,
  send: SendRounded,
  save: SaveAltRounded,
  undo: UndoRounded,
};

const categoryIconMapping: Record<categoryIconNameType, React.ElementType> = {
  person: PersonRounded,
  building: BusinessRounded,
  house: HomeRounded,
  work: WorkRounded,
  contact: ContactMailRounded,
};
const iconMapping = {
  ...materialIconMapping,
  ...categoryIconMapping,
};

type iconNameType = keyof typeof materialIconMapping | keyof typeof categoryIconMapping;

function Icon(props: { iconName: iconNameType }) {
  const IconComponent = iconMapping[props.iconName];
  return <IconComponent />;
}
