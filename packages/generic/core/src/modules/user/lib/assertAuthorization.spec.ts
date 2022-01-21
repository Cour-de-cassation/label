import { userGenerator } from '../generator';
import { assertAuthorization } from './assertAuthorization';

describe('assertAuthorization', () => {
  it('should throw an error if the user is deactivated', () => {
    const user = userGenerator.generate({ isActivated: false, email: 'test@email.com' });

    expect(() => assertAuthorization(user)).toThrowError('The user test@email.com is deactivated');
  });
});
