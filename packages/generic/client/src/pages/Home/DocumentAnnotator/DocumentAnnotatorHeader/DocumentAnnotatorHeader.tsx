import { useTheme, Theme } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Text, MenuBar, Header } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { deleteBearerTokenInLocalStorage } from '../../../../services/localStorage';
import { ReportProblemButton } from './ReportProblemButton';

export { DocumentAnnotatorHeader };

function DocumentAnnotatorHeader(props: { annotatorStateHandler: annotatorStateHandlerType }) {
  const history = useHistory();
  const theme = useTheme();
  const styles = buildStyles(theme);

  return (
    <MenuBar color="default">
      <Header
        style={styles.header}
        leftHeaderComponents={[<Text>{props.annotatorStateHandler.get().document.title}</Text>]}
        rightHeaderComponents={[
          <ReportProblemButton annotatorStateHandler={props.annotatorStateHandler} />,
          <Button style={styles.logoutButton} onClick={logout} iconName="logout"></Button>,
        ]}
      />
    </MenuBar>
  );

  function buildStyles(theme: Theme) {
    return {
      header: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
      },
      reportProblemButton: {
        paddingRight: theme.spacing(2),
      },
      logoutButton: {
        height: theme.shape.borderRadius * 2,
        width: theme.shape.borderRadius * 2,
      },
    };
  }

  function logout() {
    deleteBearerTokenInLocalStorage();
    history.push('/login');
  }
}
