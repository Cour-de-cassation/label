export { isPasswordValid };

const MIN_PASSWORD_LENGTH = 8;

function isPasswordValid(password: string) {
  return password.length >= MIN_PASSWORD_LENGTH;
}
