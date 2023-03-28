const apiPath = '/api/v1';
const empty = '';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
  signUpPath: () => [apiPath, '/signup'].join('/'),
  notFoundPath: () => [empty, '*'].join('/'),
  loginPagePath: () => [empty, 'login'].join('/'),
  signUpPagePath: () => [empty, 'signup'].join('/'),
  mainPagePath: () => [empty, ''].join('/'),
};
