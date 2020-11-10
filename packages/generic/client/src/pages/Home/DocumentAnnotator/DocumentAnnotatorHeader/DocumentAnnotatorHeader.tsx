import React from 'react';
import { useHistory } from 'react-router-dom';
import { Header, IconButton, MenuBar, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { deleteBearerTokenInLocalStorage } from '../../../../services/localStorage';
import { heights, useCustomTheme } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { ReportProblemButton } from './ReportProblemButton';
import { SettingsButton } from './SettingsButton';

export { DocumentAnnotatorHeader };

function DocumentAnnotatorHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  fetchNewDocument: () => Promise<void>;
}) {
  const theme = useCustomTheme();
  const style = buildStyle();
  const history = useHistory();

  return (
    <MenuBar color="inherit">
      <Header
        leftHeaderComponents={[<Text>{props.annotatorStateHandler.get().document.title}</Text>]}
        rightHeaderComponents={[
          <ReportProblemButton
            annotatorStateHandler={props.annotatorStateHandler}
            fetchNewDocument={props.fetchNewDocument}
          />,
          <SettingsButton />,
          <IconButton iconName="logout" hint={wordings.logout} onClick={logout} />,
        ]}
        spaceBetweenComponents={theme.spacing * 2}
        style={style.header}
        variant="classic"
      />
    </MenuBar>
  );

  function buildStyle() {
    return {
      header: {
        height: heights.header,
      },
    };
  }

  function logout() {
    deleteBearerTokenInLocalStorage();
    history.push('/login');
  }
}
