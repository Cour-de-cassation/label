import React, { useState } from 'react';
import { flatten, sumBy, uniq } from 'lodash';
import { apiRouteOutType, idModule, keysOf, treatmentInfoType, timeOperator, treatmentModule } from '@label/core';
import { DecisionNumberTextInput, PublicationCategoryBadge, tableRowFieldType } from '../../../components';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { ExportCSVButton } from './ExportCSVButton';
import { TreatedDocumentsFilters, treatedDocumentFilterType } from './TreatedDocumentsFilters';
import { StatisticsBox } from './StatisticsBox';
import { TreatedDocumentsTable } from './TreatedDocumentsTable';

export { TreatedDocuments };

const DEFAULT_FILTERS = {
  startDate: undefined,
  endDate: undefined,
  userName: undefined,
  publicationCategoryLetter: undefined,
  mustHaveSurAnnotations: false,
  mustHaveSubAnnotations: false,
};

function TreatedDocuments(props: { treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'> }) {
  const theme = useCustomTheme();
  const [filterValues, setFilterValues] = useState<treatedDocumentFilterType>(DEFAULT_FILTERS);
  const [searchedDecisionNumber, setSearchedDecisionNumber] = useState<number | undefined>();
  const styles = buildStyles(theme);

  const filterInfo = extractFilterInfoFromTreatedDocuments(props.treatedDocuments);
  const summedTreatmentsInfo = computeSummedTreatmentsInfo(props.treatedDocuments);
  const treatmentFields = buildTreatedDocumentsFields(summedTreatmentsInfo);
  const filteredTreatedDocuments = searchedDecisionNumber
    ? filterSearchedDecisions(props.treatedDocuments, searchedDecisionNumber)
    : getFilteredTreatedDocuments(props.treatedDocuments, summedTreatmentsInfo, filterValues);
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
            <DecisionNumberTextInput value={searchedDecisionNumber} onChange={setSearchedDecisionNumber} />
          </div>
          <div style={styles.rightHeaderContent}>
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

  function computeSummedTreatmentsInfo(treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>) {
    const treatments = flatten(treatedDocuments.map((treatedDocument) => treatedDocument.treatments)).filter(
      (treatment) => treatment.source === 'annotator',
    );
    const treatmentsInfo = treatmentModule.lib.computeTreatmentsInfo(treatments);
    const summedTreatmentsInfo = treatedDocuments.reduce((documentAccumulator, treatedDocument) => {
      const documentIdString = idModule.lib.convertToString(treatedDocument.document._id);
      const documentTreatmentsInfo = treatedDocument.treatments
        .filter((treatment) => treatment.source === 'annotator')
        .map((treatment) => treatmentsInfo[idModule.lib.convertToString(treatment._id)]);
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
        if (currentFilterKey === 'publicationCategoryLetter' && !!filterValues.publicationCategoryLetter) {
          return (
            accumulator && treatedDocument.document.publicationCategory.includes(filterValues.publicationCategoryLetter)
          );
        }
        return accumulator;
      }, true as boolean);
    });
  }

  function extractFilterInfoFromTreatedDocuments(treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>) {
    const userNames = uniq(treatedDocuments.map((treatedDocument) => treatedDocument.userName));
    const publicationCategoryLetters = uniq(
      flatten(treatedDocuments.map((treatedDocument) => treatedDocument.document.publicationCategory)),
    );
    return { publicationCategoryLetters, userNames };
  }

  function buildTreatedDocumentsFields(treatmentsInfo: Record<string, treatmentInfoType>) {
    const treatedDocumentsFields: Array<tableRowFieldType<apiRouteOutType<'get', 'treatedDocuments'>[number]>> = [
      {
        id: 'documentId',
        title: wordings.treatedDocumentsPage.table.columnTitles.number.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.number.title,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.documentId,
        width: 10,
      },
      {
        id: 'publicationCategory',
        title: wordings.treatedDocumentsPage.table.columnTitles.publicationCategory.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.publicationCategory.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.publicationCategory.join(','),
        render: (treatedDocument) => (
          <div style={styles.publicationCategoryBadgesContainer}>
            {treatedDocument.document.publicationCategory.map((publicationCategoryLetter) => (
              <div style={styles.publicationCategoryBadgeContainer}>
                <PublicationCategoryBadge publicationCategoryLetter={publicationCategoryLetter} />
              </div>
            ))}
          </div>
        ),
        width: 10,
      },
      {
        id: 'userName',
        title: wordings.treatedDocumentsPage.table.columnTitles.agent.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.agent.tooltipText,
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
        getSortingValue: (treatedDocument) =>
          treatedDocument.treatments[treatedDocument.treatments.length - 1].lastUpdateDate,
        width: 10,
      },
      {
        id: 'deletions',
        title: wordings.treatedDocumentsPage.table.columnTitles.surAnnotation.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.surAnnotation.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].deletionsCount,
        width: 3,
      },
      {
        id: 'resizeSmaller',
        title: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationSmaller.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationSmaller.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].resizedSmallerCount,
        width: 3,
      },
      {
        id: 'additions',
        title: wordings.treatedDocumentsPage.table.columnTitles.subAnnotation.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.subAnnotation.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].additionsCount,
        width: 3,
      },
      {
        id: 'resizeBigger',
        title: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationBigger.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationBigger.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].resizedBiggerCount,
        width: 3,
      },
      {
        id: 'modifications',
        title: wordings.treatedDocumentsPage.table.columnTitles.changeAnnotation.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.changeAnnotation.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].modificationsCount,
        width: 3,
      },
      {
        id: 'duration',
        canBeSorted: true,
        title: wordings.treatedDocumentsPage.table.columnTitles.duration.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.duration.tooltipText,
        extractor: (treatedDocument) =>
          timeOperator.convertDurationToReadableDuration(
            sumBy(treatedDocument.treatments, (treatment) => treatment.duration),
          ),
        getSortingValue: (treatedDocument) => sumBy(treatedDocument.treatments, (treatment) => treatment.duration),
        width: 3,
      },
    ];
    return treatedDocumentsFields;
  }

  function filterSearchedDecisions(
    treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>,
    searchedDecisionNumber: number,
  ) {
    return treatedDocuments.filter((treatedDocument) =>
      treatedDocument.document.documentId.toString().includes(searchedDecisionNumber.toString()),
    );
  }
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
      display: 'flex',
      width: '100vw',
      height: heights.adminPanel,
    },
    leftHeaderContent: {
      flex: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: theme.spacing * 4,
    },
    tableHeaderContainer: {
      height: heights.adminTreatmentsTableHeader,
    },
    publicationCategoryBadgesContainer: {
      display: 'flex',
    },
    publicationCategoryBadgeContainer: {
      marginRight: theme.spacing,
    },
    rightHeaderContent: {
      flex: 1,
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
      width: widths.adminContent,
      paddingLeft: theme.spacing * 3,
      paddingRight: theme.spacing * 2,
    },
  } as const;
}
