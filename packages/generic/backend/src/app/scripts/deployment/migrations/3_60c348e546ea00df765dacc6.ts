import { buildUserRepository } from '../../../../modules/user';
import { logger } from '../../../../utils';

export { up, down };

async function up() {
  logger.log('Up: ');

  const userRepository = buildUserRepository();
  const users = await userRepository.findAll();

  await Promise.all(
    users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (user.role === ('specialDocumentAnnotator' as any)) {
        return userRepository.updateOne(user._id, {
          role: 'publicator',
        });
      }
    }),
  );
}

async function down() {
  logger.log('Down: ');

  const userRepository = buildUserRepository();
  const users = await userRepository.findAll();

  await Promise.all(
    users.map((user) => {
      if (user.role === 'publicator') {
        return userRepository.updateOne(user._id, {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          role: 'specialDocumentAnnotator' as any,
        });
      }
    }),
  );
}
