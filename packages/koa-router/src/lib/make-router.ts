import Application from 'koa';

import {
  ConfigEntity,
  RouteControllerResult,
  RouterContext,
  RouterMiddleware,
} from '../types';
import { castResponse } from './cast-response';
import {
  getController,
  getMiddleware,
  setMiddlewareAndControllers,
} from './fn-conteiner';
import { getConfigByPath } from './get-config-by-path';
import { middlewareQueue } from './middleware-queue';
import { RouteManager } from './route-manager';

const routeManager = new RouteManager();

export const makeRouter = (pathToConfig: string): Application.Middleware => {
  const config: ConfigEntity = getConfigByPath(pathToConfig);

  setMiddlewareAndControllers(pathToConfig, config);

  routeManager.setRouters(config.routes);

  /**
   * Koa Middleware
   */
  return async (ctx: Application.Context, next: Application.Next) => {
    // находим нужный роут учитывая параметр methods роута, если он есть
    const route = routeManager.getRouteByUrlPath(ctx.path, ctx.method);

    if (!route) {
      next();
      return;
    }

    // route context
    ctx.route = routeManager.toCurrentRoute(ctx, route);
    const ctxRoute = ctx as RouterContext;

    // соибраем очередь из мидлваров
    // строим массив из мадваров и роута, для выполнения
    const queue = [];

    if (route.middleware) {
      queue.push(...route.middleware.map((key) => getMiddleware(key)));
    }

    let result:
      | RouteControllerResult
      | ReturnType<RouterMiddleware> = await middlewareQueue(ctxRoute, queue);

    if (result === true) {
      const controller = getController(route.controller);
      result = await controller(ctxRoute);
    }

    // если у роута есть параметр response то кастим ответ согласно ему,
    // если нет, то пытаемся определить ответ относительно резульата его выполнения
    // добавляем в контекст свойство router для текущего роута
    castResponse(ctxRoute, route, result);
  };
  // если в опции makeRouter указан параметр, то выводим в консоль таблицу роутов
};
