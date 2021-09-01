import React from 'react';
import { wordings } from '../../../wordings';
import { IconButton } from './IconButton';
import { Loader } from './Loader';

const REFRESH_BUTTON_SIZE = 40;

export { RefreshButton };

function RefreshButton(props: { onClick: () => void; isLoading: boolean }) {
  const styles = buildStyles();
  if (props.isLoading) {
    return (
      <div style={styles.refreshLoaderContainer}>
        <Loader />
      </div>
    );
  }
  return (
    <IconButton
      buttonSize={REFRESH_BUTTON_SIZE}
      backgroundColor="primary"
      onClick={props.onClick}
      hint={wordings.shared.refresh}
      iconName="reset"
    />
  );
}

function buildStyles() {
  return {
    refreshLoaderContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: REFRESH_BUTTON_SIZE,
      height: REFRESH_BUTTON_SIZE,
    },
  };
}
