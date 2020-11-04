import { useTheme, Theme } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Header, IconButton, MenuBar, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { deleteBearerTokenInLocalStorage } from '../../../../services/localStorage';
import { ReportProblemButton } from './ReportProblemButton';

export { DocumentAnnotatorHeader };

function DocumentAnnotatorHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  fetchNewDocument: () => Promise<void>;
}) {
  const history = useHistory();
  const theme = useTheme();
  const styles = buildStyles(theme);

  return (
    <MenuBar color="default">
      <Header
        style={styles.header}
        leftHeaderComponents={[<Text>{props.annotatorStateHandler.get().document.title}</Text>]}
        rightHeaderComponents={[
          <ReportProblemButton
            annotatorStateHandler={props.annotatorStateHandler}
            fetchNewDocument={props.fetchNewDocument}
          />,
          <IconButton onClick={logout} iconName="logout" />,
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
