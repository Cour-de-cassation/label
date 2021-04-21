import { documentType, idType } from '@label/core';
import { projectedType } from '../../../repository';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  findAllByStatus: (
    status: documentType['status'][],
  ) => Promise<documentType[]>;
  findAllByStatusProjection: <projectionT extends keyof documentType>(
    status: documentType['status'][],
    projection: Array<projectionT>,
  ) => Promise<Array<projectedType<documentType, projectionT>>>;
  findAllByPublicationCategoryAndStatus: ({
    publicationCategory,
    status,
  }: {
    publicationCategory: documentType['publicationCategory'];
    status: documentType['status'];
  }) => Promise<documentType[]>;
  findOneByStatusAndPriorityAmong: (
    {
      status,
      priority,
    }: { status: documentType['status']; priority: documentType['priority'] },
    idsToSearchInFirst: documentType['_id'][],
  ) => Promise<documentType | undefined>;
  updateStatusById: (
    id: idType,
    status: documentType['status'],
  ) => Promise<void>;
  updateOneStatusByIdAndStatus: (
    filter: { status: documentType['status']; _id: documentType['_id'] },
    update: { status: documentType['status'] },
  ) => Promise<boolean>;
};
