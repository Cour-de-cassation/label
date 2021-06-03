import React, { useState } from 'react';
import { flatten, sumBy, uniq } from 'lodash';
import { apiRouteOutType, idModule, indexer, keysOf, treatmentInfoType, timeOperator } from '@label/core';
import { DecisionNumberTextInput, IconButton, PublicationCategoryBadge, tableRowFieldType } from '../../../components';
import {
  localStorage,
  treatedDocumentOrderByProperties,
  treatedDocumentFilterType,
} from '../../../services/localStorage';
import { customThemeType, heights, useCustomTheme, widths } from '../../../styles';
import { wordings } from '../../../wordings';
import { ExportCSVButton } from './ExportCSVButton';
import { TreatedDocumentsFilters } from './TreatedDocumentsFilters';
import { TreatedDocumentsTable } from './TreatedDocumentsTable';

export { TreatedDocuments };

function TreatedDocuments(props: {
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
  refetch: () => void;
}) {
  const theme = useCustomTheme();
  const INITIAL_FILTER_VALUES = localStorage.treatedDocumentsStateHandler.getFilters();
  const [filterValues, setFilterValues] = useState<treatedDocumentFilterType>(INITIAL_FILTER_VALUES);
  const [searchedDecisionNumber, setSearchedDecisionNumber] = useState<number | undefined>();
  const styles = buildStyles(theme);

  const filterInfo = extractFilterInfoFromTreatedDocuments(props.treatedDocuments);
  const summedTreatmentsInfo = computeSummedTreatmentsInfo(props.treatedDocuments);
  const treatmentFields = buildTreatedDocumentsFields(summedTreatmentsInfo);
  const filteredTreatedDocuments = searchedDecisionNumber
    ? filterSearchedDecisions(props.treatedDocuments, searchedDecisionNumber)
    : getFilteredTreatedDocuments(props.treatedDocuments, summedTreatmentsInfo, filterValues);

  return (
    <div style={styles.table}>
      <div style={styles.tableHeaderContainer}>
        <div style={styles.tableHeader}>
          <div style={styles.headerContent}>
            <TreatedDocumentsFilters
              filterInfo={filterInfo}
              filterValues={filterValues}
              setFilterValues={setAndStoreFilterValues}
              resultsCount={filteredTreatedDocuments.length}
            />
            <div style={styles.tableRightHeader}>
              <div style={styles.searchTextInputContainer}>
                <DecisionNumberTextInput value={searchedDecisionNumber} onChange={setSearchedDecisionNumber} />
              </div>
              <IconButton
                backgroundColor="primary"
                onClick={props.refetch}
                hint={wordings.shared.refresh}
                iconName="reset"
              />
            </div>
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

  function setAndStoreFilterValues(filterValues: treatedDocumentFilterType) {
    localStorage.treatedDocumentsStateHandler.setFilters(filterValues);
    setFilterValues(filterValues);
  }

  function computeSummedTreatmentsInfo(treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>) {
    const treatments = flatten(treatedDocuments.map((treatedDocument) => treatedDocument.treatments)).filter(
      (treatment) => treatment.source === 'annotator',
    );
    const indexedTreatments = indexer.indexBy(treatments, (treatment) => idModule.lib.convertToString(treatment._id));
    const summedTreatmentsInfo = treatedDocuments.reduce((documentAccumulator, treatedDocument) => {
      const documentIdString = idModule.lib.convertToString(treatedDocument.document._id);
      const documentTreatments = treatedDocument.treatments
        .filter((treatment) => treatment.source === 'annotator')
        .map((treatment) => indexedTreatments[idModule.lib.convertToString(treatment._id)]);
      return {
        ...documentAccumulator,
        [documentIdString]: documentTreatments.reduce(
          (treatmentInfoAccumulator, treatment) => ({
            additionsCount: treatmentInfoAccumulator.additionsCount + treatment.addedAnnotationsCount,
            deletionsCount: treatmentInfoAccumulator.deletionsCount + treatment.deletedAnnotationsCount,
            modificationsCount: treatmentInfoAccumulator.modificationsCount + treatment.modifiedAnnotationsCount,
            resizedSmallerCount:
              treatmentInfoAccumulator.resizedSmallerCount + treatment.resizedSmallerAnnotationsCount,
            resizedBiggerCount: treatmentInfoAccumulator.resizedBiggerCount + treatment.resizedBiggerAnnotationsCount,
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
        if (currentFilterKey === 'userName' && !!filterValues.userName) {
          return accumulator && treatedDocument.userNames.includes(filterValues.userName);
        }
        if (currentFilterKey === 'source' && !!filterValues.source) {
          return accumulator && treatedDocument.document.source === filterValues.source;
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
    const userNames = uniq(flatten(treatedDocuments.map((treatedDocument) => treatedDocument.userNames)));
    const publicationCategoryLetters = uniq(
      flatten(treatedDocuments.map((treatedDocument) => treatedDocument.document.publicationCategory)),
    );
    const sources = uniq(treatedDocuments.map((treatedDocument) => treatedDocument.document.source));
    return { publicationCategoryLetters, userNames, sources };
  }

  function buildTreatedDocumentsFields(treatmentsInfo: Record<string, treatmentInfoType>) {
    const treatedDocumentsFields: Array<tableRowFieldType<
      apiRouteOutType<'get', 'treatedDocuments'>[number],
      typeof treatedDocumentOrderByProperties[number]
    >> = [
      {
        id: 'documentNumber',
        title: wordings.treatedDocumentsPage.table.columnTitles.number.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.number.title,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.documentNumber,
        width: 3,
      },
      {
        id: 'publicationCategory',
        title: wordings.treatedDocumentsPage.table.columnTitles.publicationCategory.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.publicationCategory.tooltipText,
        canBeSorted: true,
        getSortingValue: (treatedDocument) => treatedDocument.document.publicationCategory.length,
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
        width: 2,
      },
      {
        id: 'source',
        title: wordings.treatedDocumentsPage.table.columnTitles.source.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.source.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.source,
        width: 2,
      },
      {
        id: 'userName',
        title: wordings.treatedDocumentsPage.table.columnTitles.agent.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.agent.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.userNames.join(', '),
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
        width: 5,
      },
      {
        id: 'deletions',
        title: wordings.treatedDocumentsPage.table.columnTitles.surAnnotation.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.surAnnotation.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].deletionsCount,
        width: 2,
      },
      {
        id: 'resizeSmaller',
        title: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationSmaller.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationSmaller.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].resizedSmallerCount,
        width: 2,
      },
      {
        id: 'additions',
        title: wordings.treatedDocumentsPage.table.columnTitles.subAnnotation.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.subAnnotation.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].additionsCount,
        width: 2,
      },
      {
        id: 'resizeBigger',
        title: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationBigger.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.resizeAnnotationBigger.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].resizedBiggerCount,
        width: 2,
      },
      {
        id: 'modifications',
        title: wordings.treatedDocumentsPage.table.columnTitles.changeAnnotation.title,
        tooltipText: wordings.treatedDocumentsPage.table.columnTitles.changeAnnotation.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) =>
          treatmentsInfo[idModule.lib.convertToString(treatedDocument.document._id)].modificationsCount,
        width: 2,
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
      treatedDocument.document.documentNumber.toString().includes(searchedDecisionNumber.toString()),
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
    headerContent: {
      flex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: theme.spacing * 2,
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
    tableHeader: {
      paddingTop: theme.spacing * 2,
      display: 'flex',
      justifyContent: 'space-between',
    },
    tableRightHeader: {
      display: 'flex',
    },
    searchTextInputContainer: {
      marginRight: theme.spacing * 2,
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
