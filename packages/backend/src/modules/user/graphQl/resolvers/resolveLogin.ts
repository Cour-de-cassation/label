import { GraphQLFieldResolver } from 'graphql';
import { userDtoType } from '../../types/userDtoType';
import { userService } from '../../services';

export { resolveLogin };

const resolveLogin: GraphQLFieldResolver<any, any, any> = async (
  _root,
  user: userDtoType,
) => {
  return userService.login(user);
};
