import React, { ReactElement } from 'react';
import { AdminMenu, MainHeader, Text } from '../../components';
import { heights } from '../../styles';

export { AdminPage };

function AdminPage(props: {
  userRole: 'admin' | 'scrutator';
  header: { title: string; subtitle: string };
  unreadProblemReportsCount: number;
  toBeConfirmedDocumentsCount: number;
  children: ReactElement;
}) {
  const styles = buildStyles();

  return (
    <>
      <div style={styles.header}>
        <MainHeader title={props.header.title} subtitle={<Text>{props.header.subtitle}</Text>} />
      </div>
      <div style={styles.contentContainer}>
        <AdminMenu
          toBeConfirmedDocumentsCount={props.toBeConfirmedDocumentsCount}
          unreadProblemReportsCount={props.unreadProblemReportsCount}
          userRole={props.userRole}
        />
        {props.children}
      </div>
    </>
  );
}

function buildStyles() {
  return {
    header: {
      height: heights.header,
    },
    contentContainer: {
      display: 'flex',
      width: '100vw',
      height: heights.adminPanel,
    },
  } as const;
}
