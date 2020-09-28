import { GraphQLFieldResolver } from 'graphql';
import { userModule } from '@label/core';
import { buildUserRepository } from '../../repository';
import { hasher } from '../../../../lib/hasher';
import { userDtoType } from '../../types/userDtoType';

export { resolveInsertUser };

const resolveInsertUser: GraphQLFieldResolver<any, any, any> = async (
  _root,
  user: userDtoType,
) => {
  const hashedPassword = await hasher.hash(user.password);
  const userRepository = buildUserRepository();
  const newUser = userModule.lib.buildUser({
    email: user.email,
    password: hashedPassword,
  });
  return userRepository.insert(newUser);
};
