import React, { ReactElement, useState } from 'react';
import { heights, Text } from 'pelta-design-system';
import { AdminMenu, MainHeader } from '../../components';
import { localStorage } from '../../services/localStorage';

export { AdminPage };

function AdminPage(props: {
  userRole: 'admin' | 'scrutator';
  header: { title: string; subtitle: string };
  unreadProblemReportsCount: number;
  toBeConfirmedDocumentsCount: number;
  children: ReactElement;
}) {
  const styles = buildStyles();

  const [userRole, setUserRole] = useState<'admin' | 'scrutator'>(props.userRole);

  return (
    <>
      <div style={styles.header}>
        <MainHeader
          title={props.header.title}
          subtitle={<Text>{props.header.subtitle}</Text>}
          updateAdminMenu={() => {
            setUserRole(localStorage.adminViewHandler.get() as 'admin' | 'scrutator');
          }}
        />
      </div>
      <div style={styles.contentContainer}>
        <AdminMenu
          toBeConfirmedDocumentsCount={props.toBeConfirmedDocumentsCount}
          unreadProblemReportsCount={props.unreadProblemReportsCount}
          userRole={userRole}
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
