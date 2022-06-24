import { uniq } from 'lodash';
import { documentType } from '@label/core';
import { buildProjection, buildRepositoryBuilder } from '../../../repository';
import { customDocumentRepositoryType } from './customDocumentRepositoryType';

export { buildDocumentRepository };

const buildDocumentRepository = buildRepositoryBuilder<
  documentType,
  customDocumentRepositoryType
>({
  collectionName: 'documents',
  indexes: [
    {
      index: {
        status: 1,
      },
    } as const,
    {
      index: {
        publicationCategory: 1,
        status: 1,
      },
    } as const,
    {
      index: {
        priority: 1,
        status: 1,
      },
    } as const,
  ],
  buildCustomRepository: (collection) => ({
    async countNotIn(idsNotToSearchIn) {
      const count = await collection.countDocuments({
        _id: { $nin: idsNotToSearchIn },
      });
      return count;
    },

    async findNotIn(idsNotToSearchIn) {
      return collection
        .find({
          _id: { $nin: idsNotToSearchIn },
        })
        .toArray();
    },

    async findAllPublicationCategories() {
      const publicationCategories = await collection.distinct(
        'publicationCategory',
        {},
      );

      return uniq(publicationCategories);
    },

    async findOneByDocumentNumberAndSource({ documentNumber, source }) {
      const document = await collection.findOne({ source, documentNumber });
      return document || undefined;
    },

    async findOneByStatusAndPriorityAmong(
      { status, priority },
      idsToSearchInFirst,
    ) {
      const freeDocuments = await collection
        .find({
          priority,
          status,
          _id: { $in: idsToSearchInFirst },
        })
        .sort({ 'decisionMetadata.date': -1 })
        .limit(1)
        .toArray();
      return freeDocuments[0];
    },

    async findByStatusAndPriorityLimitAmong(
      { status, priority },
      limit,
      idsToSearchInFirst,
    ) {
      const documents = await collection
        .find({
          priority,
          status,
          _id: { $in: idsToSearchInFirst },
        })
        .sort({ 'decisionMetadata.date': -1 })
        .limit(limit)
        .toArray();
      return documents;
    },

    async findOneByStatusAndPriorityNotIn(
      { status, priority },
      idsNotToSearchIn,
    ) {
      const document = await collection.findOne({
        priority,
        status,
        _id: { $nin: idsNotToSearchIn },
      });
      return document || undefined;
    },

    async findAllByNACCodesAndStatus(
      NACCodes: documentType['decisionMetadata']['NACCode'][],
      statuses: documentType['status'][],
    ) {
      return collection
        .find(buildFindAllByNACCodesAndStatusRequest(NACCodes, statuses))
        .toArray();
    },

    async findAllByPublicationCategoryLettersAndStatus(
      publicationCategoryLetters,
      statuses,
    ) {
      return collection
        .find(
          buildFindByPublicationCategoryLettersAndStatusRequest(
            publicationCategoryLetters,
            statuses,
          ),
        )
        .toArray();
    },

    async findAllByPublicationCategoryLettersProjection(
      publicationCategoryLetters,
      projections,
    ) {
      return collection
        .find(
          buildFindByPublicationCategoryLettersRequest(
            publicationCategoryLetters,
          ),
        )
        .project(buildProjection(projections))
        .toArray();
    },

    async findAllByStatus(status) {
      return collection.find({ status: { $in: status } }).toArray();
    },

    async findAllByStatusProjection(status, projection) {
      return collection
        .find({ status: { $in: status } })
        .project(buildProjection(projection))
        .toArray();
    },

    async updateStatusById(_id, status) {
      await collection.updateOne(
        { _id },
        { $set: buildUpdateStatusQuery(status) },
      );
      const updatedDocument = await collection.findOne({ _id });
      return updatedDocument || undefined;
    },

    async updateOneStatusByIdAndStatus(filter, update) {
      await collection.updateOne(
        { _id: filter._id, status: filter.status },
        { $set: buildUpdateStatusQuery(update.status) },
      );
      const updatedDocument = await collection.findOne({ _id: filter._id });
      return updatedDocument || undefined;
    },
  }),
});

function buildUpdateStatusQuery(status: documentType['status']) {
  return { status, updateDate: new Date().getTime() };
}

function buildFindByPublicationCategoryLettersRequest(
  publicationCategoryLetters: string[],
) {
  return {
    $or: publicationCategoryLetters.map((publicationCategoryLetter) => ({
      publicationCategory: { $in: [publicationCategoryLetter] },
    })),
  };
}

function buildFindAllByNACCodesAndStatusRequest(
  NACCodes: string[],
  statuses: documentType['status'][],
) {
  return {
    status: { $in: statuses },
    $or: NACCodes.map((NACCode) => ({
      'decisionMetadata.NACCode': { $in: [NACCode] },
    })),
  };
}

function buildFindByPublicationCategoryLettersAndStatusRequest(
  publicationCategoryLetters: string[],
  statuses: documentType['status'][],
) {
  return {
    status: { $in: statuses },
    $or: publicationCategoryLetters.map((publicationCategoryLetter) => ({
      publicationCategory: { $in: [publicationCategoryLetter] },
    })),
  };
}
