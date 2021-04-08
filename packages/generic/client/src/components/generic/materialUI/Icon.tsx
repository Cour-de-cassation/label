import React, { CSSProperties } from 'react';
import {
  AccessibilityNewRounded,
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
  DoneRounded,
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
  HourglassEmptyRounded,
  HowToRegRounded,
  Link,
  LinkOff,
  LocationCityRounded,
  LoopRounded,
  MapRounded,
  MoreVertRounded,
  PersonAddRounded,
  PersonRounded,
  PhoneRounded,
  PlaylistAddCheckRounded,
  PlaylistPlayRounded,
  PowerSettingsNewRounded,
  PublicRounded,
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
  UpdateRounded,
} from '@material-ui/icons';
import { categoryIconNameType } from '@label/core';
import { Tooltip } from './Tooltip';

export { Icon };

export type { iconNameType };

const materialIconMapping = {
  addPerson: PersonAddRounded,
  admin: SupervisorAccountRounded,
  arrowDown: ExpandMoreRounded,
  arrowLeft: ChevronLeftRounded,
  arrowRight: ChevronRightRounded,
  arrowUp: ExpandLessRounded,
  assigned: HowToRegRounded,
  bug: BugReportRounded,
  check: DoneRounded,
  clock: AlarmOnRounded,
  close: CloseRounded,
  copy: FileCopyOutlined,
  delete: DeleteOutlineRounded,
  discussion: QuestionAnswerRounded,
  doubleArrow: SettingsEthernetRounded,
  edit: EditRounded,
  error: ErrorRounded,
  export: GetAppRounded,
  human: AccessibilityNewRounded,
  lightBulb: EmojiObjectsRounded,
  link: Link,
  login: ExitToAppRounded,
  logout: PowerSettingsNewRounded,
  minus: RemoveCircleRounded,
  more: MoreVertRounded,
  playlistPlay: PlaylistPlayRounded,
  playlistCheck: PlaylistAddCheckRounded,
  plus: AddCircleRounded,
  puzzle: ExtensionRounded,
  redo: RedoRounded,
  reset: LoopRounded,
  send: SendRounded,
  settings: SettingsRounded,
  stop: BlockRounded,
  undo: UndoRounded,
  unlink: LinkOff,
  update: UpdateRounded,
  waiting: HourglassEmptyRounded,
  warning: ReportProblemRounded,
  world: PublicRounded,
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
