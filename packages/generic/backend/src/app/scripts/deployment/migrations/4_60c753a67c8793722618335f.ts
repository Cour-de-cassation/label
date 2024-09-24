import { buildUserRepository } from '../../../../modules/user';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log({ operationName: 'migration', msg: 'Up: ' });

  const userRepository = buildUserRepository();

  const users = await userRepository.findAll();

  await Promise.all(
    users.map((user) =>
      userRepository.updateOne(user._id, {}))
  );
}

async function down() {
  logger.log({ operationName: 'migration', msg: 'Down: ' });

  const userRepository = buildUserRepository();

  await userRepository.deletePropertiesForMany({}, ['']);
}
