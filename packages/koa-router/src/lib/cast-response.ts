import Application from 'koa';

import {
  RouteConfigItem,
  RouteControllerResult,
  RouterMiddleware,
} from '../types';

export const castResponse = (
  ctx: Application.Context,
  route: RouteConfigItem,
  result: RouteControllerResult | ReturnType<RouterMiddleware>
) => {
  if (!ctx.body && result) {
    ctx.body = result;
  }

  // if (route.response) {
  //   ctx.response.set(route.response);
  // }
};
