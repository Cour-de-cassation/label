import React from 'react';
import { MainHeader } from '../../../components';
import { heights } from '../../../styles';
import { wordings } from '../../../wordings';

export { Agents };

function Agents() {
  const styles = buildStyles();
  return (
    <div style={styles.header}>
      <MainHeader title={wordings.agentsPage.title} subtitle={wordings.agentsPage.subtitle} />
    </div>
  );

  function buildStyles() {
    return {
      header: {
        height: heights.header,
      },
    };
  }
}
