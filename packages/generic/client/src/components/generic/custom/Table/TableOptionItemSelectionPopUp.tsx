import React from 'react';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { Text } from '../../materialUI';
import { ButtonWithIcon } from '../ButtonWithIcon';
import { LabelledDropdown } from '../LabelledDropdown';
import { PopUp } from '../PopUp';

export { TableOptionItemSelectionPopUp };

const DROPDOWN_WIDTH = 250;

function TableOptionItemSelectionPopUp(props: {
  description: string;
  dropdownLabel: string;
  items: Array<string>;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const dropdownItems = props.items.map((text) => ({ text, value: text }));
  return (
    <PopUp>
      <div style={styles.contentContainer}>
        <Text style={styles.description}>{props.description}</Text>
        <div style={styles.dropdownContainer}>
          <LabelledDropdown<string>
            items={dropdownItems}
            label={props.dropdownLabel}
            onChange={props.onSelect}
            width={DROPDOWN_WIDTH}
          />
        </div>
        <div style={styles.cancelButtonContainer}>
          <ButtonWithIcon iconName="close" onClick={props.onClose} text={wordings.shared.cancel} color="default" />
        </div>
      </div>
    </PopUp>
  );
}

function buildStyles(theme: customThemeType) {
  return {
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    dropdownContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: theme.spacing * 6,
    },
    cancelButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    description: {
      marginBottom: theme.spacing * 3,
    },
  } as const;
}
