export interface Field {
    name: string;
    type: string;
    mandatory: boolean;
    default?: any;
    values?: string[];
    relation?: string;
}

export interface Definition {
    version: number;
    name: string;
    description: string;
    fields: Field[];
}

export interface RoleAccess {
    path: string;
    method: string;
    roles: string[];
}

export interface ConfigItem {
    routes: RoleAccess[];
}

export interface RolesAndAccessConfig {
    [key: string]: ConfigItem;
}
