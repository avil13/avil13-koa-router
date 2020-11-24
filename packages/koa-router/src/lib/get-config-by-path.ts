import { readFileSync } from 'fs';
//@ts-ignore
import yaml from 'js-yaml';
import { ConfigEntity } from '../types';

const defaultConfig: ConfigEntity = {
  options: {
    middlewarePath: './middleware',
    controllerPath: './controller',
  },
  middleware: {},
  routes: [],
};

export const getConfigByPath = (pathToConfig: string): ConfigEntity => {
  const configContent = readFileSync(pathToConfig, 'utf8');

  const configJson: ConfigEntity = yaml.safeLoad(configContent);

  if (!configJson.options) {
    configJson.options = defaultConfig.options;
  }

  if (!configJson.middleware) {
    configJson.middleware = defaultConfig.middleware;
  }

  return configJson;
};
