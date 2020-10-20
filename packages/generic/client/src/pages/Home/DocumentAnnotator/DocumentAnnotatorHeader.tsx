import { useTheme, Theme } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, LayoutGrid } from '../../../components';
import { deleteBearerTokenInLocalStorage } from '../../../services/localStorage';

export { DocumentAnnotatorHeader };

function DocumentAnnotatorHeader() {
  const history = useHistory();
  const theme = useTheme();
  const styles = buildStyles(theme);

  return (
    <LayoutGrid container justifyContent="space-between" alignItems="center">
      <LayoutGrid item>
        <div />
      </LayoutGrid>
      <LayoutGrid item>
        <Button style={styles.logoutButton} onClick={logout} iconName="logout"></Button>
      </LayoutGrid>
    </LayoutGrid>
  );

  function buildStyles(theme: Theme) {
    return {
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
