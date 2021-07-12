import { omit } from 'lodash';
import { userModule, userType } from '@label/core';
import { buildUserRepository } from '../../../../modules/user';
import { up, down } from '../migrations/8_60ec074c4888807011142476';

describe('add passwordLastUpdateDate in user model', () => {
  const passwordLastUpdateDate = new Date().getTime();
  const userWithNewModel = userModule.generator.generate({
    passwordLastUpdateDate,
  });
  const userWithOldModel = omit(userWithNewModel, ['passwordLastUpdateDate']);

  it('should test up', async () => {
    const userRepository = buildUserRepository();
    await userRepository.insert(userWithOldModel as userType), await up();

    const usersAfterUpdateModel = await userRepository.findAll();
    expect(
      usersAfterUpdateModel.map((userAfterUpdateModel) =>
        omit(userAfterUpdateModel, 'passwordLastUpdateDate'),
      ),
    ).toEqual([omit(userWithNewModel, 'passwordLastUpdateDate')]);
    expect(
      roughlyComparesTimestamps(
        usersAfterUpdateModel[0].passwordLastUpdateDate,
        userWithNewModel.passwordLastUpdateDate,
      ),
    ).toBeTruthy();
  });

  it('should test down', async () => {
    const userRepository = buildUserRepository();
    await userRepository.insert(userWithNewModel);

    await down();

    const usersAfterUpdateModel = await userRepository.findAll();
    expect(usersAfterUpdateModel).toEqual([userWithOldModel]);
  });
});

function roughlyComparesTimestamps(timestamp1: number, timestamp2: number) {
  const ERROR_MARGIN = 1000;
  return Math.abs(timestamp1 - timestamp2) < ERROR_MARGIN;
}
