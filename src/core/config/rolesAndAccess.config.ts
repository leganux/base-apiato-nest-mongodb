interface RoleAccess {
  path: string;
  method: string;
  roles: string[];
}

interface ConfigItem {
  routes: RoleAccess[];
}

export interface RolesAndAccessConfig {
  [key: string]: ConfigItem;
}

export const rolesMap = {
  ALL: ['Admin', 'User', 'Public'],
  REGISTERED: ['Admin', 'User'],
  ADMIN: ['Admin'],
  PUBLIC: ['Public'],
};

export const rolesAndAccessConfig: RolesAndAccessConfig = {
  user: {
    routes: [
      { path: '/', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/many', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/', method: 'GET', roles: rolesMap.ALL },
      { path: '/where', method: 'GET', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'GET', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'PUT', roles: rolesMap.REGISTERED },
      { path: '/updateOrCreate', method: 'PUT', roles: rolesMap.REGISTERED },
      { path: '/findAndUpdate', method: 'PUT', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'DELETE', roles: rolesMap.ADMIN },
      { path: '/datatable', method: 'POST', roles: rolesMap.ADMIN },
    ],
  },
  auth: {
    routes: [
      { path: '/register', method: 'POST', roles: rolesMap.PUBLIC },
      { path: '/login', method: 'POST', roles: rolesMap.PUBLIC },
      { path: '/verify-email', method: 'GET', roles: rolesMap.PUBLIC },
    ],
  },
  files: {
    routes: [
      { path: '/upload', method: 'POST', roles: rolesMap.REGISTERED },
      { path: '/upload/many', method: 'POST', roles: rolesMap.REGISTERED },
      { path: '/view', method: 'GET', roles: rolesMap.ALL },
    ],
  },
  mail: {
    routes: [{ path: '/send', method: 'POST', roles: rolesMap.ADMIN }],
  },
};
