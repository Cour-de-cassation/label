import { documentType, idType } from '@label/core';
import { projectedType } from '../../../repository';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  countNotIn: (idsNotToSearchIn: documentType['_id'][]) => Promise<number>;
  findNotIn: (
    idsNotToSearchIn: documentType['_id'][],
  ) => Promise<documentType[]>;
  findAllPublicationCategories: () => Promise<Array<string>>;
  findAllByStatus: (
    status: documentType['status'][],
  ) => Promise<documentType[]>;
  findAllByStatusProjection: <projectionT extends keyof documentType>(
    status: documentType['status'][],
    projection: Array<projectionT>,
  ) => Promise<Array<projectedType<documentType, projectionT>>>;
  findAllByNACCodesAndStatus: (
    publicationCategory: documentType['publicationCategory'],
    statuses: documentType['status'][],
  ) => Promise<Array<documentType>>;
  findAllByPublicationCategoryLettersAndStatus: (
    publicationCategory: documentType['publicationCategory'],
    statuses: documentType['status'][],
  ) => Promise<Array<documentType>>;
  findAllByPublicationCategoryLettersProjection: <
    projectionT extends keyof documentType
  >(
    publicationCategory: documentType['publicationCategory'],
    projections: Array<projectionT>,
  ) => Promise<Array<projectedType<documentType, projectionT>>>;
  findOneByDocumentNumberAndSource: ({
    documentNumber,
    source,
  }: {
    documentNumber: documentType['documentNumber'];
    source: documentType['source'];
  }) => Promise<documentType | undefined>;
  findOneByStatusAndPriorityAmong: (
    {
      status,
      priority,
    }: { status: documentType['status']; priority: documentType['priority'] },
    idsToSearchInFirst: documentType['_id'][],
  ) => Promise<documentType | undefined>;
  findOneRandomByStatusAndPriorityAmong: (
    {
      status,
      priority,
    }: { status: documentType['status']; priority: documentType['priority'] },
    idsToSearchInFirst: documentType['_id'][],
  ) => Promise<documentType | undefined>;
  findByStatusAndPriorityLimitAmong: (
    {
      status,
      priority,
    }: { status: documentType['status']; priority: documentType['priority'] },
    limit: number,
    idsToSearchInFirst: documentType['_id'][],
  ) => Promise<documentType[]>;
  findOneByStatusAndPriorityNotIn: (
    {
      status,
      priority,
    }: { status: documentType['status']; priority: documentType['priority'] },
    idsNotToSearchIn: documentType['_id'][],
  ) => Promise<documentType | undefined>;
  updateStatusById: (
    _id: idType,
    status: documentType['status'],
  ) => Promise<documentType | undefined>;
  updateOneStatusByIdAndStatus: (
    filter: { status: documentType['status']; _id: documentType['_id'] },
    update: { status: documentType['status'] },
  ) => Promise<documentType | undefined>;
};
