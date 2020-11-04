import { useTheme, Theme } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ButtonWithIcon, Header, IconButton, MenuBar, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { deleteBearerTokenInLocalStorage } from '../../../../services/localStorage';
import { wordings } from '../../../../wordings';
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
          <div style={styles.spaceBetweenButton}></div>,
          <ButtonWithIcon iconName="settings" onClick={() => console.log} text={wordings.settings} />,
          <div style={styles.spaceBetweenButton}></div>,
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
      spaceBetweenButton: {
        paddingLeft: theme.spacing(2),
      },
    };
  }

  function logout() {
    deleteBearerTokenInLocalStorage();
    history.push('/login');
  }
}
