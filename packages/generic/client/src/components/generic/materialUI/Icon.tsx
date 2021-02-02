import React, { CSSProperties } from 'react';
import {
  AccountBalanceRounded,
  AlarmOnRounded,
  BookRounded,
  BugReportRounded,
  BusinessCenterRounded,
  ChildCareRounded,
  ChildFriendlyRounded,
  CloseRounded,
  CloudRounded,
  DeleteOutlineRounded,
  DirectionsCarRounded,
  EmojiObjectsRounded,
  ErrorRounded,
  ExitToAppRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  ExtensionRounded,
  FavoriteRounded,
  FileCopyRounded,
  GavelRounded,
  GetAppRounded,
  Link,
  LinkOff,
  LoopRounded,
  MapRounded,
  MeetingRoom,
  MoreVertRounded,
  PersonRounded,
  PhoneRounded,
  QuestionAnswerRounded,
  RedoRounded,
  ReportProblemRounded,
  RoomRounded,
  SaveAltRounded,
  SendRounded,
  SettingsRounded,
  StoreRounded,
  UndoRounded,
} from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import { categoryIconNameType } from '@label/core';

export { Icon };

export type { iconNameType };

const materialIconMapping = {
  arrowExpand: ExpandMoreRounded,
  arrowReduce: ExpandLessRounded,
  bug: BugReportRounded,
  clock: AlarmOnRounded,
  close: CloseRounded,
  copy: FileCopyRounded,
  delete: DeleteOutlineRounded,
  discussion: QuestionAnswerRounded,
  error: ErrorRounded,
  export: GetAppRounded,
  lightBulb: EmojiObjectsRounded,
  link: Link,
  login: ExitToAppRounded,
  logout: MeetingRoom,
  more: MoreVertRounded,
  puzzle: ExtensionRounded,
  redo: RedoRounded,
  reset: LoopRounded,
  send: SendRounded,
  save: SaveAltRounded,
  settings: SettingsRounded,
  undo: UndoRounded,
  unlink: LinkOff,
  warning: ReportProblemRounded,
};

const categoryIconMapping: Record<categoryIconNameType, React.ElementType> = {
  bank: AccountBalanceRounded,
  book: BookRounded,
  car: DirectionsCarRounded,
  child: ChildCareRounded,
  cloud: CloudRounded,
  hammer: GavelRounded,
  heart: FavoriteRounded,
  location: RoomRounded,
  map: MapRounded,
  person: PersonRounded,
  phone: PhoneRounded,
  store: StoreRounded,
  stroller: ChildFriendlyRounded,
  work: BusinessCenterRounded,
};

const iconMapping = {
  ...materialIconMapping,
  ...categoryIconMapping,
};

type iconNameType = keyof typeof materialIconMapping | keyof typeof categoryIconMapping;

function Icon(props: { iconName: iconNameType; hint?: string; style?: CSSProperties }) {
  const IconComponent = iconMapping[props.iconName];
  if (props.hint) {
    return (
      <Tooltip title={props.hint}>
        <IconComponent style={props.style} />
      </Tooltip>
    );
  }
  return <IconComponent style={props.style} />;
}
