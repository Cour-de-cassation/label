import { userType } from '@label/core';

export type userDtoType = Pick<userType, 'email' | 'password'>;
