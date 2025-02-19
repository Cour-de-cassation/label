import '@babel/polyfill';
jest.mock('@label/sso', () => ({
  SamlService: jest.fn().mockImplementation(() => ({})),
}));
