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
        route: 1,
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
    async countByStatus(status) {
      return await collection.countDocuments({
        status: { $in: status },
      });
    },

    async countNotIn(idsNotToSearchIn) {
      return await collection.countDocuments({
        _id: { $nin: idsNotToSearchIn },
      });
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

    async findOneByExternalId(externalId) {
      const document = await collection.findOne({ externalId });
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

    async findOneRandomByStatusAndPriorityAmong(
      { status, priority },
      idsToSearchInFirst,
    ) {
      const mostRecentDocuments = await collection
        .find({
          priority,
          status,
          _id: { $in: idsToSearchInFirst },
        })
        .sort({ 'decisionMetadata.date': -1 })
        .limit(50)
        .toArray();

      const leastRecentDocuments = await collection
        .find({
          priority,
          status,
          _id: { $in: idsToSearchInFirst },
        })
        .sort({ 'decisionMetadata.date': 1 })
        .limit(50)
        .toArray();

      // Combine the two lists to treat a mix of recent and old documents
      const combinedDocuments = mostRecentDocuments.concat(
        leastRecentDocuments,
      );

      if (combinedDocuments.length === 0) {
        return undefined;
      }

      // Select a random document from the combined list
      return combinedDocuments[
        Math.floor(Math.random() * combinedDocuments.length)
      ];
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

    async findOneByStatusWithoutLossNotIn(statuses, idsNotToSearchIn) {
      const document = await collection.findOne({
        status: { $in: statuses },
        loss: undefined,
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

    async findAllByRoutesOrPublicationCategoryLettersProjection(
      routes,
      publicationCategories,
      projections,
    ) {
      return collection
        .find({
          $or: [
            { route: { $in: routes } },
            ...publicationCategories.map((publicationCategoryLetter) => ({
              publicationCategory: { $in: [publicationCategoryLetter] },
            })),
          ],
        })
        .project(buildProjection(projections))
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

    async updateNlpVersionsById(_id, nlpVersions) {
      await collection.updateOne({ _id }, { $set: { nlpVersions } });
      const updatedDocument = await collection.findOne({ _id });
      return updatedDocument || undefined;
    },

    async updateLossById(_id, loss) {
      await collection.updateOne({ _id }, { $set: { loss } });
      const updatedDocument = await collection.findOne({ _id });
      return updatedDocument || undefined;
    },

    async updateChecklistById(_id, checklist) {
      await collection.updateOne({ _id }, { $set: { checklist } });
      const updatedDocument = await collection.findOne({ _id });
      return updatedDocument || undefined;
    },

    async updateAdditionalTermsParsingFailed(
      _id,
      additionalTermsParsingFailed,
    ) {
      await collection.updateOne(
        { _id },
        {
          $set: {
            'decisionMetadata.additionalTermsParsingFailed': additionalTermsParsingFailed,
          },
        },
      );
      const updatedDocument = await collection.findOne({ _id });
      return updatedDocument || undefined;
    },

    async updateCategoriesToOmitById(_id, categoriesToOmit) {
      await collection.updateOne(
        { _id },
        { $set: { 'decisionMetadata.categoriesToOmit': categoriesToOmit } },
      );
      const updatedDocument = await collection.findOne({ _id });
      return updatedDocument || undefined;
    },

    async updateComputedAdditionalTerms(_id, computedAdditionalTerms) {
      await collection.updateOne(
        { _id },
        {
          $set: {
            'decisionMetadata.computedAdditionalTerms': computedAdditionalTerms,
          },
        },
      );
      const updatedDocument = await collection.findOne({ _id });
      return updatedDocument || undefined;
    },

    async updateRouteById(_id, route) {
      await collection.updateOne({ _id }, { $set: { route } });
      const updatedDocument = await collection.findOne({ _id });
      return updatedDocument || undefined;
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
