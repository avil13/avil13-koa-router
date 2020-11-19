import { readFile } from 'fs';
import { promisify } from 'util';
//@ts-ignore
import yaml from 'js-yaml';

const readFIlePromise = promisify(readFile);

interface IConfigByPathOptions {
  options?: {
    middlewarePath?: string;
    controllersPath?: string;
  };
  routeOptions?: {
    prefix: string;
  };
  middleware?: string[];
}

export const getConfigByPath = async (
  pathToConfig: string,
  options: IConfigByPathOptions = {}
) => {
  const configContent = await readFIlePromise(pathToConfig, 'utf8');

  const configJson = yaml.safeLoad(configContent);

  // TODO: validate
  const listRoutesResult = [];

  for (const route of configJson.routes) {
    const { importConfigPath, ...opt } = route;

    if (importConfigPath) {
      const importedRouterConfig: any = await getConfigByPath(
        importConfigPath,
        {
          routeOptions: opt,
          middleware: options.middleware,
        }
      );

      listRoutesResult.push(...importedRouterConfig.routes);
    } else if (route) {
      listRoutesResult.push({ ...route, ...options.routeOptions });
    }
  }

  configJson.routes = listRoutesResult;

  return configJson;
};
