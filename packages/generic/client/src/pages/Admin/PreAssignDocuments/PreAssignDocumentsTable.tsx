import React from 'react';
import { useHistory } from 'react-router-dom';
import format from 'string-template';
import { customThemeType, useCustomTheme, optionItemType, Table, tableRowFieldType } from 'pelta-design-system';
import { apiRouteOutType, documentModule, idModule, timeOperator } from '@label/core';
import { apiCaller } from '../../../api';
import { DocumentStatusIcon, ProblemReportIcon, PublicationCategoryBadge } from '../../../components';
import { useAlert } from '../../../services/alert';
import { usePopup } from '../../../services/popup';
import { localStorage } from '../../../services/localStorage';
import { sendMail } from '../../../services/sendMail';
import { wordings } from '../../../wordings';
import { routes } from '../../routes';

export { PreAssignDocumentsTable };

const TABLE_ICON_SIZE = 24;

const PROBLEM_REPORT_TEXT_CELL_MAX_WIDTH = 400;

function PreAssignDocumentsTable(props: {
  refetch: () => void;
  preAssignations: apiRouteOutType<'get', 'preAssignations'>;
}) {
  const history = useHistory();
  const theme = useCustomTheme();
  const { displayAlert } = useAlert();
  const { displayPopup } = usePopup();

  const styles = buildStyles(theme);
  const preAssignationFields = buildPreAssignationFields();
  const userRole = localStorage.userHandler.getRole();
  const adminView = localStorage.adminViewHandler.get();

  return (
    <Table
      data={props.preAssignations}
      fields={preAssignationFields}
      // buildOptionItems={buildOptionItems}
      defaultOrderByProperty="date"
      defaultOrderDirection="desc"
    />
  );

  function buildPreAssignationFields(): Array<
    tableRowFieldType<apiRouteOutType<'get', 'preAssignations'>[number]>
  > {
    return [
      {
        id: 'source',
        title: wordings.preAssignDocumentsPage.table.columnTitles.source,
        canBeSorted: true,
        extractor: (preAssignation) => preAssignation.source,
        width: 10,
      },
      {
        id: 'documentNumber',
        title: wordings.preAssignDocumentsPage.table.columnTitles.documentNumber,
        canBeSorted: true,
        extractor: (preAssignation) => preAssignation.documentNumber,
        width: 10,
      },
      {
        id: 'userName',
        title: wordings.preAssignDocumentsPage.table.columnTitles.agent,
        canBeSorted: true,
        extractor: (preAssignation) => preAssignation.userId.toHexString(),
        width: 10,
      },
      {
        id: 'creationDate',
        title: wordings.preAssignDocumentsPage.table.columnTitles.creationDate,
        canBeSorted: true,
        extractor: (preAssignation) => preAssignation.creationDate? timeOperator.convertTimestampToReadableDate(preAssignation.creationDate): '-',
        width: 10,
      },
    ];

  }
}

function buildStyles(theme: customThemeType) {
  return {
    publicationCategoryBadgesContainer: {
      display: 'flex',
    },
    publicationCategoryBadgeContainer: {
      marginRight: theme.spacing,
    },
  };
}
