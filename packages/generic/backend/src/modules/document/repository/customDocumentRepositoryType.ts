import { documentType, idType } from '@label/core';
import { projectedType } from '../../../repository';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  assign: (priority: documentType['priority']) => Promise<documentType>;
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
  updateStatusById: (
    id: idType,
    status: documentType['status'],
  ) => Promise<void>;
};
