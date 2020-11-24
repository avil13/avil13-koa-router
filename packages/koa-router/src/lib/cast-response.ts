import {
  RouterContext,
  RouteConfigItem,
  RouteControllerResult,
  RouterMiddleware,
} from '../types';

export const castResponse = (
  ctx: RouterContext,
  route: RouteConfigItem,
  result: RouteControllerResult | ReturnType<RouterMiddleware>
) => {
  if (!ctx.body && result) {
    ctx.body = result;
  }

  if (route.response) {
    //@ts-ignore
    ctx.response.set(route.response);
  }
};
