import React, { useState } from 'react';
import { flatten, sumBy, uniq } from 'lodash';
import { apiRouteOutType, idModule, keysOf, treatmentInfoType, treatmentModule } from '@label/core';
import { AdminMenu, MainHeader, tableRowFieldType } from '../../../components';
import { timeOperator } from '../../../services/timeOperator';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { ExportCSVButton } from './ExportCSVButton';
import { TreatedDocumentsFilters, treatedDocumentFilterType } from './TreatedDocumentsFilters';
import { StatisticsBox } from './StatisticsBox';
import { TreatedDocumentsDataFetcher } from './TreatedDocumentsDataFetcher';
import { TreatedDocumentsTable } from './TreatedDocumentsTable';

export { TreatedDocuments };

const DEFAULT_FILTERS = {
  startDate: undefined,
  endDate: undefined,
  userName: undefined,
  mustHaveSurAnnotations: false,
  mustHaveSubAnnotations: false,
};

function TreatedDocuments() {
  const theme = useCustomTheme();
  const [filterValues, setFilterValues] = useState<treatedDocumentFilterType>(DEFAULT_FILTERS);
  const styles = buildStyles(theme);
  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.treatedDocumentsPage.title} subtitle={wordings.treatedDocumentsPage.subtitle} />
      </div>
      <div style={styles.contentContainer}>
        <AdminMenu />
        <TreatedDocumentsDataFetcher>
          {({ treatedDocuments }) => {
            const filterInfo = extractFilterInfoFromTreatedDocuments(treatedDocuments);
            const summedTreatmentsInfo = computeSummedTreatmentsInfo(treatedDocuments);
            const treatmentFields = buildTreatedDocumentsFields(summedTreatmentsInfo);
            const filteredTreatedDocuments = getFilteredTreatedDocuments(
              treatedDocuments,
              summedTreatmentsInfo,
              filterValues,
            );
            const filteredDocumentIdsString = filteredTreatedDocuments.map((treatedDocument) =>
              idModule.lib.convertToString(treatedDocument.document._id),
            );
            const filteredTreatmentsInfo = Object.entries(summedTreatmentsInfo).reduce(
              (accumulator, [documentIdString, treatmentsInfo]) => {
                if (filteredDocumentIdsString.includes(documentIdString)) {
                  return {
                    ...accumulator,
                    [documentIdString]: treatmentsInfo,
                  };
                }
                return accumulator;
              },
              {} as Record<string, treatmentInfoType>,
            );

            const totalDuration = sumBy(
              flatten(filteredTreatedDocuments.map((treatedDocument) => treatedDocument.treatments)),
              (treatment) => treatment.duration,
            );

            return (
              <div style={styles.table}>
                <div style={styles.tableHeaderContainer}>
                  <div style={styles.tableHeader}>
                    <div style={styles.leftHeaderContent}>
                      <TreatedDocumentsFilters
                        filterInfo={filterInfo}
                        filterValues={filterValues}
                        setFilterValues={setFilterValues}
                        resultsCount={filteredTreatedDocuments.length}
                      />
                    </div>
                    <div style={styles.statisticsBoxContainer}>
                      <StatisticsBox
                        totalDuration={totalDuration}
                        treatedDocumentsCount={filteredTreatedDocuments.length}
                        treatmentsInfo={filteredTreatmentsInfo}
                      />
                    </div>
                  </div>
                </div>
                <div style={styles.tableContentContainer}>
                  <TreatedDocumentsTable treatedDocuments={filteredTreatedDocuments} fields={treatmentFields} />
                </div>
                <div style={styles.csvButtonContainer}>
                  <ExportCSVButton data={filteredTreatedDocuments} fields={treatmentFields} />
                </div>
              </div>
            );
          }}
        </TreatedDocumentsDataFetcher>
      </div>
    </>
  );

  function computeSummedTreatmentsInfo(treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>) {
    // TO DO filter par est-ce que ça a été fait par un humain
    const treatments = flatten(treatedDocuments.map((treatedDocument) => treatedDocument.treatments));
    const treatmentsInfo = treatmentModule.lib.computeTreatmentsInfo(treatments);
    const summedTreatmentsInfo = treatedDocuments.reduce((documentAccumulator, treatedDocument) => {
      const documentIdString = idModule.lib.convertToString(treatedDocument.document._id);
      const documentTreatmentsInfo = treatedDocument.treatments.map(
        (treatment) => treatmentsInfo[idModule.lib.convertToString(treatment._id)],
      );
      return {
        ...documentAccumulator,
        [documentIdString]: documentTreatmentsInfo.reduce(
          (treatmentInfoAccumulator, documentTreatmentInfo) => ({
            additionsCount: treatmentInfoAccumulator.additionsCount + documentTreatmentInfo.additionsCount,
            deletionsCount: treatmentInfoAccumulator.deletionsCount + documentTreatmentInfo.deletionsCount,
            modificationsCount: treatmentInfoAccumulator.modificationsCount + documentTreatmentInfo.modificationsCount,
            resizedSmallerCount:
              treatmentInfoAccumulator.resizedSmallerCount + documentTreatmentInfo.resizedSmallerCount,
            resizedBiggerCount: treatmentInfoAccumulator.resizedBiggerCount + documentTreatmentInfo.resizedBiggerCount,
          }),
          {
            additionsCount: 0,
            deletionsCount: 0,
            modificationsCount: 0,
            resizedSmallerCount: 0,
            resizedBiggerCount: 0,
          },
        ),
      };
    }, {} as Record<string, treatmentInfoType>);
    return summedTreatmentsInfo;
  }

  function getFilteredTreatedDocuments(
    treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>,
    treatmentsInfo: Record<string, treatmentInfoType>,
    filterValues: treatedDocumentFilterType,
  ) {
    return treatedDocuments.filter((treatedDocument) => {
      return keysOf(filterValues).reduce((accumulator, currentFilterKey) => {
        if (currentFilterKey === 'mustHaveSurAnnotations' && !!filterValues[currentFilterKey]) {
          const treatmentInfo = treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)];
          return accumulator && treatmentInfo.deletionsCount > 0;
        }
        if (currentFilterKey === 'mustHaveSubAnnotations' && !!filterValues[currentFilterKey]) {
          const treatmentInfo = treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)];
          return accumulator && treatmentInfo.additionsCount > 0;
        }
        if (currentFilterKey === 'startDate' && !!filterValues.startDate) {
          return (
            accumulator &&
            treatedDocument.treatments[treatedDocument.treatments.length - 1].lastUpdateDate >=
              filterValues.startDate.getTime()
          );
        }
        if (currentFilterKey === 'endDate' && !!filterValues.endDate) {
          return (
            accumulator &&
            treatedDocument.treatments[treatedDocument.treatments.length - 1].lastUpdateDate <=
              filterValues.endDate.getTime()
          );
        }
        if (currentFilterKey === 'userName' && !!filterValues[currentFilterKey]) {
          return accumulator && treatedDocument.userName === filterValues.userName;
        }
        return accumulator;
      }, true as boolean);
    });
  }

  function extractFilterInfoFromTreatedDocuments(treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>) {
    const userNames = uniq(treatedDocuments.map((treatedDocument) => treatedDocument.userName));
    return { userNames };
  }

  function buildTreatedDocumentsFields(treatmentsInfo: Record<string, treatmentInfoType>) {
    const treatedDocumentsFields: Array<tableRowFieldType<
      apiRouteOutType<'get', 'treatedDocuments'>[number],
      string | number
    >> = [
      {
        id: 'documentId',
        title: wordings.treatedDocumentsPage.table.columnTitles.number,
        canBeSorted: true,
        extractor: (treatedDocument) => JSON.stringify(treatedDocument.document.documentId),
        width: 10,
      },
      {
        id: 'userName',
        title: wordings.treatedDocumentsPage.table.columnTitles.agent,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.userName,
        width: 10,
      },
      {
        id: 'date',
        title: wordings.treatedDocumentsPage.table.columnTitles.date,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          timeOperator.convertTimestampToReadableDate(
            treatedDocument.treatments[treatedDocument.treatments.length - 1].lastUpdateDate,
            true,
          ),
        width: 10,
      },
      {
        id: 'deletions',
        title: wordings.treatedDocumentsPage.table.columnTitles.surAnnotation,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].deletionsCount,
        width: 3,
      },
      {
        id: 'resizeSmaller',
        title: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationSmaller,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].resizedSmallerCount,
        width: 3,
      },
      {
        id: 'additions',
        title: wordings.treatedDocumentsPage.table.columnTitles.subAnnotation,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].additionsCount,
        width: 3,
      },
      {
        id: 'resizeBigger',
        title: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationBigger,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].resizedBiggerCount,
        width: 3,
      },
      {
        id: 'modifications',
        title: wordings.treatedDocumentsPage.table.columnTitles.changeAnnotation,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].modificationsCount,
        width: 3,
      },
      {
        id: 'duration',
        canBeSorted: true,
        title: wordings.treatedDocumentsPage.table.columnTitles.duration,
        extractor: (treatedDocument) =>
          timeOperator.convertDurationToReadableDuration(
            sumBy(treatedDocument.treatments, (treatment) => treatment.duration),
          ),
        width: 3,
      },
    ];
    return treatedDocumentsFields;
  }

  function buildStyles(theme: customThemeType) {
    return {
      header: {
        height: heights.header,
      },
      csvButtonContainer: {
        position: 'fixed',
        bottom: theme.spacing,
        right: theme.spacing * 2,
      },
      contentContainer: {
        width: '100vw',
        display: 'flex',
      },
      leftHeaderContent: {
        flex: 1,
      },
      tableHeaderContainer: {
        height: heights.adminTreatmentsTableHeader,
      },
      statisticsBoxContainer: {
        marginTop: theme.spacing * 2,
      },
      tableHeader: {
        paddingTop: theme.spacing * 2,
        display: 'flex',
        justifyContent: 'space-between',
      },
      tableContentContainer: {
        height: heights.adminTreatmentsTable,
        overflowY: 'auto',
      },
      table: {
        height: heights.adminPanel,
        width: widths.adminContent,
        paddingLeft: theme.spacing * 3,
        paddingRight: theme.spacing * 2,
      },
    } as const;
  }
}
