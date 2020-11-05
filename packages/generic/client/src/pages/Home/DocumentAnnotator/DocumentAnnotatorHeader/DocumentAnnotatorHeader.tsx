import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core';
import { ButtonWithIcon, Drawer, Header, IconButton, MenuBar, Text } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { deleteBearerTokenInLocalStorage } from '../../../../services/localStorage';
import { heights } from '../../../../styles';
import { wordings } from '../../../../wordings';
import { ReportProblemButton } from './ReportProblemButton';

export { DocumentAnnotatorHeader };

function DocumentAnnotatorHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  fetchNewDocument: () => Promise<void>;
}) {
  const theme = useTheme();
  const style = buildStyle();
  const history = useHistory();
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

  return (
    <MenuBar color="default">
      <Header
        leftHeaderComponents={[<Text>{props.annotatorStateHandler.get().document.title}</Text>]}
        rightHeaderComponents={[
          <ReportProblemButton
            annotatorStateHandler={props.annotatorStateHandler}
            fetchNewDocument={props.fetchNewDocument}
          />,
          <ButtonWithIcon iconName="settings" onClick={openDrawer} text={wordings.settings} />,
          <IconButton iconName="logout" hint={wordings.logout} onClick={logout} />,
        ]}
        spaceBetweenComponents={theme.spacing(2)}
        style={style.header}
        variant="classic"
      />
      <Drawer onClose={closeDrawer} isOpen={isSettingsDrawerOpen}></Drawer>
    </MenuBar>
  );

  function buildStyle() {
    return {
      header: {
        height: heights.header,
      },
    };
  }

  function openDrawer() {
    setIsSettingsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsSettingsDrawerOpen(false);
  }

  function logout() {
    deleteBearerTokenInLocalStorage();
    history.push('/login');
  }
}
