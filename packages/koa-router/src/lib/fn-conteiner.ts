import { ConfigEntity, RouteController, RouterMiddleware } from '../types';

import { dirname, join, normalize } from 'path';

const middlewareList = new Map<string, RouterMiddleware>();
const controllerList = new Map<string, RouteController>();

//#region [ normalize ]
export const getNormalizedFnEntity = (options: {
  pathToConfig: string;
  prefixPath: string | './controller' | './middleware';
  pathAndMethod: string;
}) => {
  const { pathToConfig, prefixPath, pathAndMethod } = options;

  const dir = dirname(join(prefixPath, pathToConfig));

  const [pathToFile, methodName] = pathAndMethod.split('::');

  const filePath = normalize(join(dir, pathToFile));

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fn = methodName ? require(filePath)[methodName] : require(filePath);

  if (typeof fn !== 'function') {
    throw new Error(`"${pathAndMethod}" is not function \n ${filePath}`);
  }

  return {
    filePath,
    fn,
    key: pathAndMethod,
    name: fn.name,
  };
};
//#endregion

//#region [ middleware ]
export const addMiddleware = (key: string, fn: RouterMiddleware): void => {
  if (middlewareList.has(key)) {
    throw new Error(`middleware "${key}" already exists`);
  }

  middlewareList.set(key, fn);
};

export const getMiddleware = (key: string): RouterMiddleware => {
  const fn = middlewareList.get(key);

  if (!fn) {
    throw new Error(`middleware "${key}" not find, try add it`);
  }

  return fn;
};
//#endregion

//#region [ Controller ]
export const addController = (
  controllerName: string,
  fn: RouteController
): void => {
  if (controllerList.has(controllerName)) {
    console.warn(`Controller "${controllerName}" already exists`);
    // throw new Error(`Controller "${controllerName}" already exists`);
  }

  controllerList.set(controllerName, fn);
};

export const getController = (controllerName: string): RouteController => {
  const fn = controllerList.get(controllerName);

  if (!fn) {
    throw new Error(`Controller "${controllerName}" not find, try add it`);
  }

  return fn;
};
//#endregion

//#region [ setters ]
export const setMiddlewareAndControllers = (
  pathToConfig: string,
  config: ConfigEntity
) => {
  for (const key in config.middleware) {
    const item = getNormalizedFnEntity({
      pathToConfig,
      prefixPath: config.options.middlewarePath,
      pathAndMethod: config.middleware[key],
    });

    addMiddleware(key, item.fn);
  }

  config.routes.forEach((route) => {
    const item = getNormalizedFnEntity({
      pathToConfig,
      prefixPath: config.options.controllerPath,
      pathAndMethod: route.controller,
    });

    addController(item.name, item.fn);
  });
};
//#endregion
