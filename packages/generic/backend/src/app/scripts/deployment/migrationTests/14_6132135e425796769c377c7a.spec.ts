import {
  documentModule,
  documentType,
  idModule,
  userModule,
} from '@label/core';
import { buildUserRepository } from '../../../../modules/user';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/14_6132135e425796769c377c7a';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('update categories settings', () => {
  const user = userModule.generator.generate({
    name: 'Benoit Serrano',
    role: 'admin',
  });
  const documentsWithOldModelForUp = [
    { reviewStatus: 'none' },
    { reviewStatus: 'read' },
    { reviewStatus: 'amended' } as any,
  ].map(documentModule.generator.generate);
  const documentsWithNewModelForUp = documentsWithOldModelForUp.map(
    (documentWithOldModelForUp) => {
      let reviewStatus: documentType['reviewStatus'];
      if ((documentWithOldModelForUp.reviewStatus as any) === 'none') {
        reviewStatus = { hasBeenAmended: false, viewerNames: [] };
      } else if ((documentWithOldModelForUp.reviewStatus as any) === 'read') {
        reviewStatus = { hasBeenAmended: false, viewerNames: [user.name] };
      } else if (
        (documentWithOldModelForUp.reviewStatus as any) === 'amended'
      ) {
        reviewStatus = { hasBeenAmended: true, viewerNames: [user.name] };
      } else {
        reviewStatus = { hasBeenAmended: false, viewerNames: [] };
      }
      return documentModule.generator.generate({
        ...documentWithOldModelForUp,
        reviewStatus,
      });
    },
  );

  const documentsWithNewModelForDown = [
    { hasBeenAmended: false, viewerNames: [] },
    { hasBeenAmended: false, viewerNames: [user.name] },
    { hasBeenAmended: true, viewerNames: [user.name] },
  ].map((reviewStatus) => documentModule.generator.generate({ reviewStatus }));
  const documentsWithOldModelForDown = documentsWithNewModelForDown.map(
    (documentWithNewModelForDown) => {
      let reviewStatus = 'none';
      if (documentWithNewModelForDown.reviewStatus.hasBeenAmended) {
        reviewStatus = 'amended';
      } else if (
        documentWithNewModelForDown.reviewStatus.viewerNames.length > 0
      ) {
        reviewStatus = 'read';
      }
      return documentModule.generator.generate({
        ...documentWithNewModelForDown,
        reviewStatus: reviewStatus as any,
      });
    },
  );

  it('should test up', async () => {
    const userRepository = buildUserRepository();
    await userRepository.insert(user);
    const documentRepository = buildDocumentRepository();
    await documentRepository.insertMany(documentsWithOldModelForUp);

    await up();

    const documentsAfterUpdateModel = await documentRepository.findAllByIds();
    documentsWithOldModelForUp.forEach(({ _id }) =>
      expect(
        documentsAfterUpdateModel[idModule.lib.convertToString(_id)],
      ).toEqual(
        documentsWithNewModelForUp.find((document) =>
          idModule.lib.equalId(document._id, _id),
        ),
      ),
    );
  });

  it('should test down', async () => {
    const documentRepository = buildDocumentRepository();
    await documentRepository.insertMany(documentsWithNewModelForDown);
    await down();

    const documentsAfterUpdateModel = await documentRepository.findAllByIds();
    documentsWithNewModelForDown.forEach(({ _id }) =>
      expect(
        documentsAfterUpdateModel[idModule.lib.convertToString(_id)],
      ).toEqual(
        documentsWithOldModelForDown.find((document) =>
          idModule.lib.equalId(document._id, _id),
        ),
      ),
    );
  });
});
