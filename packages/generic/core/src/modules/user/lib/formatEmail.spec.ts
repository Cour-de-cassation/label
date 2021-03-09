import { formatEmail } from './formatEmail';

describe('formatEmail', () => {
  it('should put to lower case the email', () => {
    const email = 'MAIL@MAIL.MAIL';

    const formatedEmail = formatEmail(email);

    expect(formatedEmail).toEqual('mail@mail.mail');
  });

  it('should trim the white spaces', () => {
    const email = ' mail@mail.mail  ';

    const formatedEmail = formatEmail(email);

    expect(formatedEmail).toEqual('mail@mail.mail');
  });
});
