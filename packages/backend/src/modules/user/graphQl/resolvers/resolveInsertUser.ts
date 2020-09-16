import { GraphQLFieldResolver } from 'graphql';
import { buildUserRepository } from '../../repository';
import { hasher } from '../../../../lib/hasher';

export { resolveInsertUser };

const resolveInsertUser: GraphQLFieldResolver<any, any, any> = async (
  _root,
  { email, password },
) => {
  const hashedPassword = await hasher.hash(password);
  const userRepository = buildUserRepository();
  return userRepository.insert({ email, password: hashedPassword });
};
