import { documentModule, documentType, userType } from '@label/core';
import format from 'string-template';
import { wordings } from '../../wordings';
import { documentReviewFilterStatuses } from './documentReviewFilterStatuses';

export {
  buildJurisdictionFilter,
  buildRouteFilter,
  buildSourceFilter,
  buildPublicationCategoryLetterFilter,
  buildUserNameFilter,
  buildTreatmentDateFilter,
  buildDocumentReviewStatusFilter,
  buildMustHaveSubAnnotationsFilter,
  buildMustHaveSurAnnotationsFilter,
};

export type { filtersType };

type filtersType = {
  source: {
    value: documentType['source'] | undefined;
    setValue: (source: documentType['source'] | undefined) => void;
    possibleValues: documentType['source'][];
  };
  userName: {
    value: userType['name'] | undefined;
    setValue: (userName: userType['name'] | undefined) => void;
    possibleValues: userType['name'][];
  };
  publicationCategoryLetter: {
    value: documentType['publicationCategory'][number] | undefined;
    setValue: (publicationCategoryLetter: documentType['publicationCategory'][number] | undefined) => void;
    possibleValues: documentType['publicationCategory'][number][];
  };
  route: {
    value: documentType['route'] | undefined;
    setValue: (route: documentType['route'] | undefined) => void;
  };
  jurisdiction: {
    value: documentType['decisionMetadata']['jurisdiction'] | undefined;
    setValue: (jurisdiction: documentType['decisionMetadata']['jurisdiction'] | undefined) => void;
    possibleValues: documentType['decisionMetadata']['jurisdiction'][number][];
  };
  documentReviewFilterStatus: {
    value: typeof documentReviewFilterStatuses[number] | undefined;
    setValue: (value: typeof documentReviewFilterStatuses[number] | undefined) => void;
  };
  mustHaveSubAnnotations: {
    value: boolean | undefined;
    setValue: (value: boolean | undefined) => void;
  };
  mustHaveSurAnnotations: {
    value: boolean | undefined;
    setValue: (value: boolean | undefined) => void;
  };
  treatmentDate: {
    value: {
      startDate: Date | undefined;
      endDate: Date | undefined;
    };
    setValue: ({ startDate, endDate }: { startDate: Date | undefined; endDate: Date | undefined }) => void;
    extremumValues: { min: number | undefined; max: number | undefined };
  };
};

function buildPublicationCategoryLetterFilter({
  possibleValues,
  value,
  setValue,
}: {
  possibleValues: documentType['publicationCategory'];
  value: documentType['publicationCategory'][number] | undefined;
  setValue: (value: documentType['publicationCategory'][number] | undefined) => void;
}) {
  return {
    kind: 'dropdown' as const,
    name: 'publicationCategoryLetter',
    computeChipLabel: (publicationCategoryLetter: string) =>
      format(wordings.untreatedDocumentsPage.table.filter.chips.publicationCategoryLetter, {
        publicationCategoryLetter,
      }),
    label: wordings.business.filters.fields.publicationCategoryLetter,
    possibleValues,
    value,
    onChange: setValue,
  };
}

function buildSourceFilter({
  possibleValues,
  value,
  setValue,
}: {
  possibleValues: string[];
  value: documentType['source'] | undefined;
  setValue: (source: documentType['source'] | undefined) => void;
}) {
  return {
    kind: 'dropdown' as const,
    name: 'source',
    computeChipLabel: (source: string) =>
      format(wordings.untreatedDocumentsPage.table.filter.chips.source, {
        source,
      }),
    label: wordings.business.filters.fields.source,
    possibleValues,
    value,
    onChange: setValue,
  };
}

function buildRouteFilter({
  value,
  setValue,
}: {
  value: documentType['route'] | undefined;
  setValue: (value: documentType['route'] | undefined) => void;
}) {
  return {
    kind: 'dropdown' as const,
    name: 'route',
    label: wordings.business.filters.fields.route,
    possibleValues: (documentModule.fetchedModel.content.route.content as unknown) as string[],
    value,
    computeChipLabel: (route: string) =>
      wordings.untreatedDocumentsPage.table.filter.chips.routes[route as documentType['route']],
    computeReadableValue: (route: string) => wordings.business.documentRoute[route as documentType['route']],
    onChange: (route?: string) => setValue(route as documentType['route'] | undefined),
  };
}

function buildJurisdictionFilter({
  possibleValues,
  value,
  setValue,
}: {
  possibleValues: string[];
  value: string | undefined;
  setValue: (value: string | undefined) => void;
}) {
  return {
    kind: 'dropdown' as const,
    name: 'value',
    label: wordings.business.filters.fields.jurisdiction,
    possibleValues,
    value,
    onChange: setValue,
  };
}

function buildUserNameFilter({
  possibleValues,
  value,
  setValue,
}: {
  possibleValues: userType['name'][];
  value: userType['name'] | undefined;
  setValue: (value: userType['name'] | undefined) => void;
}) {
  return {
    kind: 'dropdown' as const,
    name: 'value',
    label: wordings.business.filters.fields.userName,
    possibleValues,
    value,
    onChange: setValue,
  };
}

function buildTreatmentDateFilter({
  value,
  setValue,
  extremumValues,
}: {
  value: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  setValue: ({ startDate, endDate }: { startDate: Date | undefined; endDate: Date | undefined }) => void;
  extremumValues: { min: number | undefined; max: number | undefined };
}) {
  return {
    kind: 'dateInterval' as const,
    name: 'dateInterval',
    extremumAvailableDates: {
      min: extremumValues.min,
      max: extremumValues.max,
    },
    value: { startDate: value.startDate, endDate: value.endDate },
    onChange: (value: { startDate: Date | undefined; endDate: Date | undefined }) => {
      setValue({ startDate: value.startDate, endDate: value.endDate });
    },
  };
}

function buildDocumentReviewStatusFilter({
  value,
  setValue,
}: {
  value: typeof documentReviewFilterStatuses[number] | undefined;
  setValue: (value: typeof documentReviewFilterStatuses[number] | undefined) => void;
}) {
  return {
    kind: 'dropdown' as const,
    name: 'documentReviewFilterStatus',
    label: wordings.treatedDocumentsPage.table.filter.fields.documentReviewFilterStatus,
    possibleValues: (documentReviewFilterStatuses as unknown) as string[],
    value,
    computeChipLabel: convertDocumentReviewStatusToReadable,
    computeReadableValue: convertDocumentReviewStatusToReadable,
    onChange: (documentReviewFilterStatus?: string) =>
      setValue(documentReviewFilterStatus as typeof documentReviewFilterStatuses[number] | undefined),
  };
}

function buildMustHaveSubAnnotationsFilter({
  value,
  setValue,
}: {
  value: boolean | undefined;
  setValue: (value: boolean | undefined) => void;
}) {
  return {
    kind: 'boolean' as const,
    name: 'mustHaveSubAnnotations',
    chipLabel: wordings.treatedDocumentsPage.table.filter.chips.mustHaveSubAnnotations,
    label: wordings.treatedDocumentsPage.table.filter.fields.mustHaveSubAnnotations,
    checked: !!value,
    onToggle: () => setValue(!value),
  };
}

function buildMustHaveSurAnnotationsFilter({
  value,
  setValue,
}: {
  value: boolean | undefined;
  setValue: (value: boolean | undefined) => void;
}) {
  return {
    kind: 'boolean' as const,
    name: 'mustHaveSurAnnotations',
    chipLabel: wordings.treatedDocumentsPage.table.filter.chips.mustHaveSurAnnotations,
    label: wordings.treatedDocumentsPage.table.filter.fields.mustHaveSurAnnotations,
    checked: !!value,
    onToggle: () => setValue(!value),
  };
}

function convertDocumentReviewStatusToReadable(documentReviewFilterStatus: string) {
  return wordings.business.documentReviewFilterStatus[
    documentReviewFilterStatus as typeof documentReviewFilterStatuses[number]
  ].filter;
}
