import { Route, RouterMiddleware } from '../types';

const middlewareList = new Map<string, RouterMiddleware>();
const routeList = new Map<string, Route>();

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

//#region [ route ]
export const addRoute = (routeName: string, fn: Route): void => {
  if (routeList.has(routeName)) {
    throw new Error(`route "${routeName}" already exists`);
  }

  routeList.set(routeName, fn);
};

export const getRoute = (routeName: string): Route => {
  const fn = routeList.get(routeName);

  if (!fn) {
    throw new Error(`Route "${routeName}" not find, try add it`);
  }

  return fn;
};

//#endregion
