import { readFile } from 'fs';
import { promisify } from 'util';
//@ts-ignore
import yaml from 'js-yaml';
import { ConfigEntity } from '../types';

const readFilePromise = promisify(readFile);

const defaultConfig: ConfigEntity = {
  options: {
    middlewarePath: './middleware',
    controllerPath: './controller',
  },
  middleware: {},
  routes: [],
};

export const getConfigByPath = async (
  pathToConfig: string
): Promise<ConfigEntity> => {
  const configContent = await readFilePromise(pathToConfig, 'utf8');

  const configJson: ConfigEntity = yaml.safeLoad(configContent);

  if (!configJson.options) {
    configJson.options = defaultConfig.options;
  }

  if (!configJson.middleware) {
    configJson.middleware = defaultConfig.middleware;
  }

  return configJson;
};
