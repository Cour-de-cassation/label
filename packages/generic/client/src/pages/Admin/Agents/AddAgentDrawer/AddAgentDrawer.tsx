import React, { useState } from 'react';
import { userModule, userType } from '@label/core';
import { apiCaller } from '../../../../api';
import { ButtonWithIcon, Drawer, IconButton, LabelledDropdown, Text, TextInput } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';

export { AddAgentDrawer };

const FIELD_WIDTH = 400;

const DRAWER_WIDTH = 600;

type formErrorType = {
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  role?: boolean;
};

type formValuesType = {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  role: userType['role'] | undefined;
};

function AddAgentDrawer(props: { isOpen: boolean; onClose: () => void }) {
  const [formValues, setFormValues] = useState<formValuesType>({
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    role: undefined,
  });
  const [formErrors, setFormErrors] = useState<formErrorType>({});
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
              error={!!formErrors.firstName}
              value={formValues.firstName || ''}
              onChange={(event) => updateField('firstName', event.target.value)}
              placeholder={wordings.agentsPage.createAgentDrawer.fields.firstName}
              style={styles.field}
            />
          </div>
          <div style={styles.fieldContainer}>
            <TextInput
              name="lastName"
              error={!!formErrors.lastName}
              value={formValues.lastName || ''}
              onChange={(event) => updateField('lastName', event.target.value)}
              placeholder={wordings.agentsPage.createAgentDrawer.fields.lastName}
              style={styles.field}
            />
          </div>
          <div style={styles.fieldContainer}>
            <TextInput
              name="email"
              error={!!formErrors.email}
              value={formValues.email || ''}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder={wordings.agentsPage.createAgentDrawer.fields.email}
              style={styles.field}
            />
          </div>
          <div style={styles.fieldContainer}>
            <LabelledDropdown<userType['role']>
              label={wordings.agentsPage.createAgentDrawer.fields.role}
              error={!!formErrors.role}
              items={userModule.dataModel.role.type.content.map((role) => ({
                text: wordings.agentsPage.table.roles[role],
                value: role,
              }))}
              onChange={(role: userType['role']) => updateField('role', role)}
              width={FIELD_WIDTH}
            />
          </div>
          <div style={styles.submitButtonContainer}>
            <ButtonWithIcon onClick={addAgent} iconName="human" text={wordings.agentsPage.createAgentDrawer.submit} />
          </div>
        </div>
      </div>
    </Drawer>
  );

  function updateField<T extends keyof formValuesType>(field: T, value: formValuesType[T]) {
    setFormValues({ ...formValues, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  }

  async function addAgent() {
    const { firstName, lastName, email, role } = formValues;
    if (!firstName || !lastName || !email || !role) {
      updateFormErrors();
      return;
    }
    await apiCaller.post<'createUser'>('createUser', {
      email,
      name: `${firstName} ${lastName}`,
      role,
    });
  }

  function updateFormErrors() {
    setFormErrors({
      firstName: !formValues.firstName,
      lastName: !formValues.lastName,
      email: !formValues.email,
      role: !formValues.role,
    });
  }
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
