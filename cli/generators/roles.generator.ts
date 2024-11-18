import * as fs from 'fs';
import { Definition } from '../interfaces';

export function updateRolesAndAccess(definition: Definition, configPath: string): void {
  // Read the existing config file content
  const configContent = fs.readFileSync(configPath, 'utf-8');

  // Create the new module entry
  const moduleEntry = `  ${definition.name}: {
    routes: [
      { path: '/', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/many', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/', method: 'GET', roles: rolesMap.ADMIN },
      { path: '/where', method: 'GET', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'GET', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'PUT', roles: rolesMap.REGISTERED },
      { path: '/updateOrCreate', method: 'PUT', roles: rolesMap.REGISTERED },
      { path: '/findAndUpdate', method: 'PUT', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'DELETE', roles: rolesMap.ADMIN },
      { path: '/datatable', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/schema', method: 'GET', roles: rolesMap.PUBLIC }
    ]
  }`;

  // Find the position to insert the new module
  const configStartMatch = configContent.match(/export const rolesAndAccessConfig[^{]*{/);
  if (!configStartMatch) {
    throw new Error('Could not find rolesAndAccessConfig in the file');
  }

  const configStart = configStartMatch.index! + configStartMatch[0].length;
  const existingConfig = configContent.slice(0, configStart);
  let remainingContent = configContent.slice(configStart);

  // Remove any existing module configuration
  const moduleRegex = new RegExp(`${definition.name}:\\s*{[^}]*},[\\s]*`, 'g');
  remainingContent = remainingContent.replace(moduleRegex, '');

  // Find the last module entry
  const lastModuleMatch = remainingContent.match(/[a-zA-Z]+:\s*{[^}]*},?\s*}/);
  if (!lastModuleMatch) {
    throw new Error('Could not find any module configurations');
  }

  // Insert the new module before the last closing brace
  const insertPosition = remainingContent.lastIndexOf('}');
  const updatedContent =
    existingConfig +
    remainingContent.slice(0, insertPosition) +
    (remainingContent[insertPosition - 1] !== '{' ? ',\n' : '') +
    moduleEntry +
    '\n};\n';

  fs.writeFileSync(configPath, updatedContent);
}
