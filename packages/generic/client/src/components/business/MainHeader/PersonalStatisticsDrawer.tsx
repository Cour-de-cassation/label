import React from 'react';
import { Drawer } from 'pelta-design-system';
import { wordings } from '../../../wordings';
import { PersonalStatisticsSection } from './PersonalStatisticsSection';
import { TreatedDocumentsPersonalStatisticsTable } from './TreatedDocumentsPersonalStatisticsTable';
import { PersonalStatisticsDataFetcher } from './PersonalStatisticsDataFetcher';

export { PersonalStatisticsDrawer };

function PersonalStatisticsDrawer(props: { close: () => void; isOpen: boolean }) {
  const styles = buildStyles();

  return (
    <>
      <Drawer onClose={props.close} title={wordings.shared.personalStatisticsDrawer.title} isOpen={props.isOpen}>
        <div style={styles.drawer}>
          <PersonalStatisticsSection
            content={
              <div style={styles.accountSectionContent}>
                <div style={styles.accountInfoContainer}>
                  <PersonalStatisticsDataFetcher>
                    {({ personalStatistics, refetch }) => (
                      <TreatedDocumentsPersonalStatisticsTable
                        refetch={refetch}
                        personalStatistics={personalStatistics}
                      />
                    )}
                  </PersonalStatisticsDataFetcher>
                </div>
              </div>
            }
            title={wordings.statisticsPage.treatedDecisions}
          />
        </div>
      </Drawer>
    </>
  );

  function buildStyles() {
    return {
      drawer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 600,
      },
      accountSectionContent: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      accountInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
      },
    } as const;
  }
}
