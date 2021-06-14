import { buildUserRepository } from '../../../../modules/user';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log('Up: ');

  const userRepository = buildUserRepository();

  const users = await userRepository.findAll();

  await Promise.all(
    users.map((user) =>
      userRepository.updateOne(user._id, {
        deletionDate: undefined,
      }),
    ),
  );
}

async function down() {
  logger.log('Down: ');

  const userRepository = buildUserRepository();

  await userRepository.deletePropertiesForMany({}, ['deletionDate']);
}
