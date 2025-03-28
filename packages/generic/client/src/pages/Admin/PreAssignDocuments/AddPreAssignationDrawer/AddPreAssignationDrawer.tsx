import React, { useState } from 'react';
import { apiCaller } from '../../../../api';
import {
  customThemeType,
  useCustomTheme,
  ButtonWithIcon,
  Drawer,
  LabelledDropdown,
  RichTextInput,
  Text,
} from 'pelta-design-system';
import { wordings } from '../../../../wordings';
import { idModule, userType } from '@label/core';

export { AddWorkingUserDrawer };

const FIELD_WIDTH = 400;
const DRAWER_WIDTH = 600;

const sources = ['jurinet', 'jurica', 'juritj', 'juritcom'];

type formErrorType = {
  source?: boolean;
  number?: boolean;
  user?: boolean;
};

type formValuesType = {
  source: string | undefined;
  number: string | undefined;
  user: string | undefined;
};

const INITIAL_FORM_VALUES = {
  source: undefined,
  number: undefined,
  user: undefined,
};

function AddWorkingUserDrawer(props: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  users: Array<Pick<userType, '_id' | 'name'>>;
}) {
  const [formValues, setFormValues] = useState<formValuesType>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<formErrorType>({});
  const [isLoading, setIsLoading] = useState(false);
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return (
    <>
      <Drawer
        onClose={props.onClose}
        title={wordings.preAssignDocumentsPage.createPreAssignationDrawer.title}
        isOpen={props.isOpen}
      >
        <div style={styles.drawer}>
          <div style={styles.formContainer}>
            <div style={styles.fieldContainer}>
              <LabelledDropdown
                label={wordings.preAssignDocumentsPage.createPreAssignationDrawer.fields.source}
                error={!!formErrors.source}
                items={sources.map((source) => ({
                  text: source,
                  value: source,
                }))}
                onChange={(source: string) => updateField('source', source)}
                width={FIELD_WIDTH}
              />
            </div>
            <div style={styles.fieldContainer}>
              <div style={styles.numberField}>
                <Text variant="h3">{wordings.preAssignDocumentsPage.createPreAssignationDrawer.fields.number}</Text>
              </div>
              <RichTextInput
                name="number"
                error={!!formErrors.number}
                value={formValues.number?.toString() || ''}
                onChange={(value) => updateField('number', value)}
                placeholder={wordings.preAssignDocumentsPage.createPreAssignationDrawer.fields.numberPlaceholder}
                style={styles.field}
              />
            </div>
            <div style={styles.fieldContainer}>
              <LabelledDropdown
                label={wordings.preAssignDocumentsPage.createPreAssignationDrawer.fields.user}
                error={!!formErrors.user}
                items={props.users
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((user) => ({
                    text: user.name,
                    value: idModule.lib.convertToString(user._id),
                  }))}
                onChange={(user: string) => updateField('user', user)}
                width={FIELD_WIDTH}
              />
            </div>
            <div style={styles.submitButtonContainer}>
              <ButtonWithIcon
                isLoading={isLoading}
                onClick={isLoading ? undefined : createPreAssignation}
                iconName="plus"
                text={wordings.preAssignDocumentsPage.createPreAssignationDrawer.submit}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );

  function onClose() {
    setFormErrors({});
    setFormValues(INITIAL_FORM_VALUES);
  }

  function updateField<T extends keyof formValuesType>(field: T, value: formValuesType[T]) {
    setFormValues({ ...formValues, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  }

  async function createPreAssignation() {
    const { source, number, user } = formValues;
    if (!source || !number || !user) {
      updateFormErrors();
      return;
    }
    setIsLoading(true);
    try {
      await apiCaller.post('createPreAssignation', {
        source,
        number: number.trim(),
        userId: idModule.lib.buildId(user),
      });
      props.refetch();
      props.onClose();
    } catch (error) {
      console.warn(error);
    } finally {
      onClose();
      setIsLoading(false);
    }
  }

  function updateFormErrors() {
    setFormErrors({
      source: !formValues.source,
      number: !formValues.number,
      user: !formValues.user,
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
    numberField: {
      padding: theme.spacing,
      color: theme.colors.line.level2,
    },
  } as const;
}
