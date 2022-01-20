import React, { useState } from 'react';
import { userModule, userType } from '@label/core';
import { apiCaller } from '../../../../api';
import {
  customThemeType,
  useCustomTheme,
  ButtonWithIcon,
  Drawer,
  LabelledDropdown,
  RichTextInput,
} from 'pelta-design-system';
import { wordings } from '../../../../wordings';
import { WorkingUserCreatedPopUp } from './UserCreatedPopUp';

export { AddWorkingUserDrawer };

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

const INITIAL_FORM_VALUES = {
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  role: undefined,
};

function AddWorkingUserDrawer(props: { isOpen: boolean; onClose: () => void; refetch: () => void }) {
  const [formValues, setFormValues] = useState<formValuesType>(INITIAL_FORM_VALUES);
  const [temporaryPassword, setTemporaryPassword] = useState<string | undefined>();
  const [formErrors, setFormErrors] = useState<formErrorType>({});
  const [isLoading, setIsLoading] = useState(false);
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <>
      {!!temporaryPassword && <WorkingUserCreatedPopUp onClose={onClose} password={temporaryPassword} />}
      <Drawer
        onClose={props.onClose}
        title={wordings.workingUsersPage.createWorkingUserDrawer.title}
        isOpen={props.isOpen}
      >
        <div style={styles.drawer}>
          <div style={styles.formContainer}>
            <div style={styles.fieldContainer}>
              <RichTextInput
                name="firstName"
                error={!!formErrors.firstName}
                value={formValues.firstName || ''}
                onChange={(firstName) => updateField('firstName', firstName)}
                placeholder={wordings.workingUsersPage.createWorkingUserDrawer.fields.firstName}
                style={styles.field}
              />
            </div>
            <div style={styles.fieldContainer}>
              <RichTextInput
                name="lastName"
                error={!!formErrors.lastName}
                value={formValues.lastName || ''}
                onChange={(lastName) => updateField('lastName', lastName)}
                placeholder={wordings.workingUsersPage.createWorkingUserDrawer.fields.lastName}
                style={styles.field}
              />
            </div>
            <div style={styles.fieldContainer}>
              <RichTextInput
                name="email"
                error={!!formErrors.email}
                value={formValues.email || ''}
                onChange={(email) => updateField('email', email)}
                placeholder={wordings.workingUsersPage.createWorkingUserDrawer.fields.email}
                style={styles.field}
              />
            </div>
            <div style={styles.fieldContainer}>
              <LabelledDropdown<userType['role']>
                label={wordings.workingUsersPage.createWorkingUserDrawer.fields.role}
                error={!!formErrors.role}
                items={userModule.models.user.content.role.content.map((role) => ({
                  text: wordings.business.userRoles[role],
                  value: role,
                }))}
                onChange={(role: userType['role']) => updateField('role', role)}
                width={FIELD_WIDTH}
              />
            </div>
            <div style={styles.submitButtonContainer}>
              <ButtonWithIcon
                isLoading={isLoading}
                onClick={isLoading ? undefined : addWorkingUser}
                iconName="human"
                text={wordings.workingUsersPage.createWorkingUserDrawer.submit}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );

  function onClose() {
    setTemporaryPassword(undefined);
    setFormErrors({});
    setFormValues(INITIAL_FORM_VALUES);
  }

  function updateField<T extends keyof formValuesType>(field: T, value: formValuesType[T]) {
    setFormValues({ ...formValues, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  }

  async function addWorkingUser() {
    const { firstName, lastName, email, role } = formValues;
    if (!firstName || !lastName || !email || !role) {
      updateFormErrors();
      return;
    }
    setIsLoading(true);
    try {
      const { data: temporaryPassword } = await apiCaller.post<'createUser'>('createUser', {
        email,
        name: `${firstName} ${lastName}`,
        role,
      });
      props.refetch();
      props.onClose();
      setTemporaryPassword(temporaryPassword);
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
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
