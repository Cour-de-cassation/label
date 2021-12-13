import { omit } from 'lodash';
import {
  assignationModule,
  documentModule,
  problemReportModule,
  userModule,
} from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { buildProblemReportRepository } from '../../../../modules/problemReport';
import { buildUserRepository } from '../../../../modules/user';
import { buildAssignationRepository } from '../../../../modules/assignation';
import { up, down } from '../migrations/32_61b0afbf2d03b13da8746f20';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
describe('remove assignatinId and add documentId & userId in reportProblem model', () => {
  const problemReportRepository = buildProblemReportRepository();
  const documentRepository = buildDocumentRepository();
  const userRepository = buildUserRepository();
  const assignationRepository = buildAssignationRepository();

  const document1 = documentModule.generator.generate();
  const document2 = documentModule.generator.generate();
  const userName1 = 'userName 1';
  const userName2 = 'userName 2';
  const user1 = userModule.generator.generate({ name: userName1 });
  const user2 = userModule.generator.generate({ name: userName2 });
  const assignation1 = assignationModule.generator.generate({
    userId: user1._id,
    documentId: document1._id,
  });
  const assignation2 = assignationModule.generator.generate({
    userId: user2._id,
    documentId: document2._id,
  });
  const problemText1 = 'PROBLEM_TEXT1';
  const problemText2 = 'PROBLEM_TEXT2';
  const problemType = 'bug';
  const problemReportOld1 = {
    ...omit(
      problemReportModule.generator.generate({
        text: problemText1,
        type: problemType,
      }),
      ['userId', 'documentId'],
    ),
    assignationId: assignation1._id,
  };
  const problemReportOld2 = {
    ...omit(
      problemReportModule.generator.generate({
        text: problemText2,
        type: problemType,
      }),
      ['userId', 'documentId'],
    ),
    assignationId: assignation2._id,
  };
  const problemReportNew1 = problemReportModule.generator.generate({
    userId: user1._id,
    documentId: document1._id,
    text: problemText1 + ' new',
    type: problemType,
  });
  const problemReportNew2 = problemReportModule.generator.generate({
    userId: user2._id,
    documentId: document2._id,
    text: problemText2 + ' new',
    type: problemType,
  });

  it('should test up', async () => {
    await userRepository.insert(user1);
    await userRepository.insert(user2);
    await documentRepository.insert(document1);
    await documentRepository.insert(document2);
    await assignationRepository.insert(assignation1);
    await assignationRepository.insert(assignation2);
    await problemReportRepository.insert(problemReportOld1 as any);
    await problemReportRepository.insert(problemReportOld2 as any);

    await up();

    const problemReportsAfterUpdateModel = await problemReportRepository.findAll();

    expect(problemReportsAfterUpdateModel.length).toBe(2);
    expect(problemReportsAfterUpdateModel[0].userId).toBe(user1._id);
    expect(problemReportsAfterUpdateModel[0].documentId).toBe(document1._id);
    expect((problemReportsAfterUpdateModel[0] as any).assignationId).toBe(
      undefined,
    );
    expect(problemReportsAfterUpdateModel[1].userId).toBe(user2._id);
    expect(problemReportsAfterUpdateModel[1].documentId).toBe(document2._id);
    expect((problemReportsAfterUpdateModel[1] as any).assignationId).toBe(
      undefined,
    );
  });

  it('should test down', async () => {
    await userRepository.insert(user1);
    await userRepository.insert(user2);
    await documentRepository.insert(document1);
    await documentRepository.insert(document2);
    await assignationRepository.insert(assignation1);
    await assignationRepository.insert(assignation2);
    await problemReportRepository.insert(problemReportNew1);
    await problemReportRepository.insert(problemReportNew2);

    await down();

    const problemReportsAfterUpdateModel = await problemReportRepository.findAll();

    expect(problemReportsAfterUpdateModel.length).toBe(2);
    expect(problemReportsAfterUpdateModel[0].userId).toBe(undefined);
    expect(problemReportsAfterUpdateModel[0].documentId).toBe(undefined);
    expect((problemReportsAfterUpdateModel[0] as any).assignationId).toBe(
      assignation1._id,
    );
    expect(problemReportsAfterUpdateModel[1].userId).toBe(undefined);
    expect(problemReportsAfterUpdateModel[1].documentId).toBe(undefined);
    expect((problemReportsAfterUpdateModel[1] as any).assignationId).toBe(
      assignation2._id,
    );
  });
});
