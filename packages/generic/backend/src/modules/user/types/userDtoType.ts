import { userType } from '@label/core';

export type userDtoType = {
  email: userType['email'];
  password: userType['password'];
  role?: userType['role'];
};
