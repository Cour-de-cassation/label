import { GraphQLFieldResolver } from 'graphql';
import { userService } from '../../service';
import { userDtoType } from '../../types/userDtoType';

export { resolveSignUpUser };

const resolveSignUpUser: GraphQLFieldResolver<any, any, any> = async (
  _root,
  user: userDtoType,
) => {
  await userService.signUpUser(user);
};
