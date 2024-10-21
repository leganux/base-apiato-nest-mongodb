export const rolesAndAccessConfig = {
  users: {
    routes: [
      { path: '/', method: 'post', roles: ['Admin'] },
      { path: '/', method: 'get', roles: ['Admin', 'User'] },
      { path: '/:id', method: 'get', roles: ['Admin', 'User'] },
    ],
  },
  auth: {
    routes: [
      { path: '/register', method: 'post', roles: ['Public'] },
      { path: '/login', method: 'post', roles: ['Public'] },
      { path: '/verify-email', method: 'get', roles: ['Public'] },
    ],
  },
  files: {
    routes: [
      { path: '/upload', method: 'post', roles: ['Admin', 'User'] },
      { path: '/upload/many', method: 'post', roles: ['Admin', 'User'] },
      { path: '/view', method: 'get', roles: ['Admin', 'User', 'Public'] },
    ],
  },
};
