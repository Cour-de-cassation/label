import React, { CSSProperties } from 'react';
import {
  AccountBalanceRounded,
  AddCircleRounded,
  AlarmOnRounded,
  BlockRounded,
  BookRounded,
  BugReportRounded,
  BusinessCenterRounded,
  CakeRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
  ChildCareRounded,
  CloseRounded,
  CloudRounded,
  DeleteOutlineRounded,
  DirectionsCarRounded,
  EditRounded,
  EmailRounded,
  EmojiObjectsRounded,
  ErrorRounded,
  ExitToAppRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  ExtensionRounded,
  FavoriteRounded,
  FileCopyOutlined,
  GavelRounded,
  GetAppRounded,
  Link,
  LinkOff,
  LocationCityRounded,
  LoopRounded,
  MapRounded,
  MoreVertRounded,
  PersonRounded,
  PhoneRounded,
  PlaylistPlayRounded,
  PowerSettingsNewRounded,
  QuestionAnswerRounded,
  RedoRounded,
  RemoveCircleRounded,
  ReportProblemRounded,
  RoomRounded,
  SendRounded,
  SettingsEthernetRounded,
  SettingsRounded,
  StoreRounded,
  SupervisorAccountRounded,
  UndoRounded,
} from '@material-ui/icons';
import { categoryIconNameType } from '@label/core';
import { Tooltip } from './Tooltip';

export { Icon };

export type { iconNameType };

const materialIconMapping = {
  admin: SupervisorAccountRounded,
  arrowDown: ExpandMoreRounded,
  arrowLeft: ChevronLeftRounded,
  arrowRight: ChevronRightRounded,
  arrowUp: ExpandLessRounded,
  bug: BugReportRounded,
  clock: AlarmOnRounded,
  close: CloseRounded,
  copy: FileCopyOutlined,
  delete: DeleteOutlineRounded,
  discussion: QuestionAnswerRounded,
  doubleArrow: SettingsEthernetRounded,
  error: ErrorRounded,
  export: GetAppRounded,
  lightBulb: EmojiObjectsRounded,
  link: Link,
  login: ExitToAppRounded,
  logout: PowerSettingsNewRounded,
  minus: RemoveCircleRounded,
  more: MoreVertRounded,
  playlistPlay: PlaylistPlayRounded,
  plus: AddCircleRounded,
  puzzle: ExtensionRounded,
  redo: RedoRounded,
  reset: LoopRounded,
  send: SendRounded,
  settings: SettingsRounded,
  undo: UndoRounded,
  unlink: LinkOff,
  warning: ReportProblemRounded,
};

const categoryIconMapping: Record<categoryIconNameType, React.ElementType> = {
  bank: AccountBalanceRounded,
  book: BookRounded,
  cake: CakeRounded,
  car: DirectionsCarRounded,
  city: LocationCityRounded,
  child: ChildCareRounded,
  cloud: CloudRounded,
  email: EmailRounded,
  forbidden: BlockRounded,
  hammer: GavelRounded,
  heart: FavoriteRounded,
  location: RoomRounded,
  map: MapRounded,
  pencil: EditRounded,
  person: PersonRounded,
  phone: PhoneRounded,
  store: StoreRounded,
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
