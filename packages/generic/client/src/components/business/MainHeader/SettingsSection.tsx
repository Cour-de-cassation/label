import React, { ReactElement } from 'react';
import { useCustomTheme, customThemeType, Text } from 'pelta-design-system';

export { SettingsSection };

function SettingsSection(props: { content: ReactElement; title: string }) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <div style={styles.settingsSection}>
      <div style={styles.settingsSectionTitle}>
        <Text variant="h2" weight="bold">
          {props.title}
        </Text>
      </div>
      <div style={styles.settingsSectionContent}>{props.content}</div>
    </div>
  );

  function buildStyles(theme: customThemeType) {
    return {
      settingsSection: {
        display: 'flex',
        flexDirection: 'column' as const,
        paddingTop: theme.spacing * 6,
        width: '100%',
      },
      settingsSectionTitle: {
        marginBottom: theme.spacing * 3,
      },
      settingsSectionContent: {
        paddingLeft: theme.spacing * 5,
      },
    };
  }
}
