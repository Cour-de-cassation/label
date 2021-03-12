import React, { useState } from 'react';
import { userModule, userType } from '@label/core';
import { ButtonWithIcon, Drawer, IconButton, LabelledDropdown, Text, TextInput } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';

export { AddAgentDrawer };

const FIELD_WIDTH = 400;

const DRAWER_WIDTH = 600;

function AddAgentDrawer(props: { isOpen: boolean; onClose: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<userType['role'] | undefined>();
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <Drawer onClose={props.onClose} isOpen={props.isOpen}>
      <div style={styles.drawer}>
        <div style={styles.header}>
          <div>
            <Text variant="h1">{wordings.agentsPage.createAgentDrawer.title}</Text>
          </div>
          <div>
            <IconButton hint={wordings.homePage.cancel} onClick={props.onClose} iconName="close" />
          </div>
        </div>
        <div style={styles.formContainer}>
          <div style={styles.fieldContainer}>
            <TextInput
              name="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder={wordings.agentsPage.createAgentDrawer.fields.firstName}
              style={styles.field}
            />
          </div>
          <div style={styles.fieldContainer}>
            <TextInput
              name="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder={wordings.agentsPage.createAgentDrawer.fields.lastName}
              style={styles.field}
            />
          </div>
          <div style={styles.fieldContainer}>
            <TextInput
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={wordings.agentsPage.createAgentDrawer.fields.email}
              style={styles.field}
            />
          </div>
          <div style={styles.fieldContainer}>
            <LabelledDropdown<userType['role']>
              label={wordings.agentsPage.createAgentDrawer.fields.role}
              items={userModule.dataModel.role.type.content.map((role) => ({
                text: wordings.agentsPage.table.roles[role],
                value: role,
              }))}
              onChange={setRole}
              width={FIELD_WIDTH}
            />
          </div>
          <div style={styles.submitButtonContainer}>
            <ButtonWithIcon
              onClick={() => addAgent(firstName, lastName, email, role)}
              iconName="human"
              text={wordings.agentsPage.createAgentDrawer.submit}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function addAgent(firstName: string, lastName: string, email: string, role: userType['role'] | undefined) {
  console.log(firstName, lastName, email, role);
}

function buildStyles(theme: customThemeType) {
  return {
    drawer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: DRAWER_WIDTH,
      padding: theme.spacing * 6,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing * 5,
      borderBottom: 'solid 1px',
      borderBottomColor: theme.colors.separator,
      width: '100%',
    },
    formContainer: {
      paddingTop: theme.spacing * 6,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    fieldContainer: {
      marginBottom: theme.spacing * 5,
    },
    field: {
      width: FIELD_WIDTH,
    },
    submitButtonContainer: {
      alignSelf: 'flex-end',
    },
  } as const;
}
