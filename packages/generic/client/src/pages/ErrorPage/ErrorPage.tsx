import React from 'react';
import { Icon, MainHeader, Text } from '../../components';
import { wordings } from '../../wordings';

export { ErrorPage };

function ErrorPage() {
  const style = buildStyle();

  return (
    <>
      <MainHeader />

      <span style={style.errorPage}>
        <Icon iconName="warning" style={style.errorIcon} />
        <Text>{wordings.errorPage}</Text>
      </span>
    </>
  );

  function buildStyle() {
    return {
      errorPage: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      errorIcon: {
        alignSelf: 'center',
        fontSize: '100px',
        padding: '24px',
      },
    } as const;
  }
}
