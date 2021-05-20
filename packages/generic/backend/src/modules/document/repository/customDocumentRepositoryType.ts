import { documentType, idType } from '@label/core';
import { projectedType } from '../../../repository';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  countNotIn: (idsNotToSearchIn: documentType['_id'][]) => Promise<number>;
  findAllPublicationCategories: () => Promise<Array<string>>;
  findAllSources: () => Promise<Array<string>>;
  findAllByStatus: (
    status: documentType['status'][],
  ) => Promise<documentType[]>;
  findAllByStatusProjection: <projectionT extends keyof documentType>(
    status: documentType['status'][],
    projection: Array<projectionT>,
  ) => Promise<Array<projectedType<documentType, projectionT>>>;
  findAllByPublicationCategoryLettersProjection: <
    projectionT extends keyof documentType
  >(
    publicationCategory: documentType['publicationCategory'],
    projections: Array<projectionT>,
  ) => Promise<Array<projectedType<documentType, projectionT>>>;
  findOneByStatusAndPriorityAmong: (
    {
      status,
      priority,
    }: { status: documentType['status']; priority: documentType['priority'] },
    idsToSearchInFirst: documentType['_id'][],
  ) => Promise<documentType | undefined>;
  findOneByStatusAndPriorityNotIn: (
    {
      status,
      priority,
    }: { status: documentType['status']; priority: documentType['priority'] },
    idsNotToSearchIn: documentType['_id'][],
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
