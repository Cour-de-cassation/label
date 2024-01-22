import { userType } from '@label/core';

export const processAndSort = (users: (Pick<userType, '_id' | 'name'> | string)[]): string[] => {
  return users
    .map((name) => {
      if (typeof name === 'string') {
        const [firstName, ...lastName] = name.split(' ');
        return `${lastName.join(' ').toUpperCase()} ${firstName}`;
      } else {
        const [firstName, ...lastName] = name.name.split(' ');
        return `${lastName.join(' ').toUpperCase()} ${firstName}`;
      }
    })
    .sort();
};
