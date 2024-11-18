import { RolesAccessService } from '../roles-access/roles-access.service';

export const rolesMap = {
  ALL: ['Admin', 'User', 'Public'],
  REGISTERED: ['Admin', 'User'],
  ADMIN: ['Admin'],
  PUBLIC: ['Public'],
};

export interface RoleAccess {
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

export const getRolesAndAccessConfig = async (rolesAccessService: RolesAccessService): Promise<RolesAndAccessConfig> => {
  return await rolesAccessService.getAllConfigs();
};
