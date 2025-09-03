import '@babel/polyfill';
jest.mock('@label/backend', () => ({
  SamlService: jest.fn().mockImplementation(() => ({})),
}));
