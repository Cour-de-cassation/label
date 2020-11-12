import React, { CSSProperties } from 'react';
import {
  BusinessRounded,
  CloseRounded,
  ContactMailRounded,
  DeleteOutlineRounded,
  ExitToAppRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  ExtensionRounded,
  HomeRounded,
  Link,
  LinkOff,
  LoopRounded,
  MeetingRoom,
  PersonRounded,
  RedoRounded,
  ReportProblemRounded,
  SaveAltRounded,
  SendRounded,
  SettingsEthernetRounded,
  SettingsRounded,
  UndoRounded,
  WorkRounded,
} from '@material-ui/icons';
import { categoryIconNameType } from '@label/core/src';

export { Icon };

export type { iconNameType };

const materialIconMapping = {
  arrowExpand: ExpandMoreRounded,
  arrowReduce: ExpandLessRounded,
  changeCategory: ExtensionRounded,
  close: CloseRounded,
  delete: DeleteOutlineRounded,
  link: Link,
  login: ExitToAppRounded,
  logout: MeetingRoom,
  redo: RedoRounded,
  reset: LoopRounded,
  resize: SettingsEthernetRounded,
  send: SendRounded,
  save: SaveAltRounded,
  settings: SettingsRounded,
  undo: UndoRounded,
  unlink: LinkOff,
  warning: ReportProblemRounded,
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

function Icon(props: { iconName: iconNameType; style?: CSSProperties }) {
  const IconComponent = iconMapping[props.iconName];
  return <IconComponent style={props.style} />;
}
