import Application from 'koa';
import koaBody from 'koa-body';
import { checkCliArguments } from '../cli';
import {
  ConfigEntity,
  MakeRouterParams,
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
import { validateConfig } from './validate-config';

const routeManager = new RouteManager();

export const makeRouter = (
  routerConfig: string | MakeRouterParams
): Application.Middleware => {
  const pathToConfig =
    typeof routerConfig === 'string' ? routerConfig : routerConfig.pathToConfig;

  const koaBodyConfig =
    typeof routerConfig === 'string' ? undefined : routerConfig.koaBody;

  const config: ConfigEntity = getConfigByPath(pathToConfig);

  const isValidOrErrors = validateConfig(config);

  if (isValidOrErrors !== true) {
    // TODO: сделать человекочитаемый вывод об ошибках
    throw isValidOrErrors;
  }

  setMiddlewareAndControllers(pathToConfig, config);

  routeManager.setPathToConfig(pathToConfig);
  routeManager.setRouters(config.routes);

  checkCliArguments({
    arguments: process.argv.slice(2),
    routes: routeManager.getRoutesInfo(),
  });

  /**
   * Koa Middleware
   */
  return async (ctx: Application.Context, next: Application.Next) => {
    await new Promise((ok) => {
      // @ts-ignore
      koaBody(koaBodyConfig)(ctx, ok);
    });

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

    let result: RouteControllerResult | ReturnType<RouterMiddleware> =
      await middlewareQueue(ctxRoute, queue);

    if (result === true) {
      const controller = getController(route.name);
      result = await controller(ctxRoute);
    }

    // если у роута есть параметр response то кастим ответ согласно ему,
    // если нет, то пытаемся определить ответ относительно резульата его выполнения
    // добавляем в контекст свойство router для текущего роута
    castResponse(ctxRoute, route, result);
  };
};
