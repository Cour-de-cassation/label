import { GraphQLFieldResolver } from 'graphql';
import { buildUserRepository } from '../../repository';
import { hasher } from '../../../../lib/hasher';

export { resolveLogin };

const resolveLogin: GraphQLFieldResolver<any, any, any> = async (
  _root,
  user,
) => {
  const userRepository = buildUserRepository();
  const storedUser = await userRepository.findOne({ email: user.email });
  const isPasswordValid = await hasher.compare(
    user.password,
    storedUser.password,
  );
  if (!isPasswordValid) {
    throw new Error(
      `The received password does not match the stored one for ${user.email}`,
    );
  }
  return {
    success: true,
  };
};
