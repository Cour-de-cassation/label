import { GraphQLFieldResolver } from "graphql";
import { buildUserRepository } from "../../repository";

export { resolveInsertUser };

const resolveInsertUser: GraphQLFieldResolver<any, any, any> = (_root, user) => {
  const userRepository = buildUserRepository()
  return userRepository.insert(user);
}
