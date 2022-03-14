import Application from 'koa';
import { compile, match, pathToRegexp } from 'path-to-regexp';
import path from 'path';

import { CurrentRoute, RouteConfigItem, RouteEntity } from '../types';

export class RouteManager {
  private routes: RouteEntity[] = [];
  private pathToConfig: string = '';

  setPathToConfig(pathToConfig: string) {
    this.pathToConfig = path.dirname(pathToConfig);
  }

  setRouters(routes: RouteConfigItem[]) {
    this.routes = routes.map((item: RouteConfigItem) =>
      this.toRouteEntity(item)
    );
  }

  private toRouteEntity(routeItem: RouteConfigItem): RouteEntity {
    const isStatic = 'static' in routeItem;
    const methods = 'static' in routeItem ? 'GET|HEAD' : routeItem.methods;
    const prefix = 'prefix' in routeItem && routeItem.prefix;
    const pathToConfig = this.pathToConfig;

    const urlPath = [prefix, routeItem.path]
      .filter(Boolean)
      .join('/')
      .replace(/\/+/g, '/'); // Replaces repeated slashes in the URL.

    return {
      ...routeItem,
      isStatic,
      getFilePath(filePath: string) {
        if (!isStatic) {
          return null;
        }
        return path.join(pathToConfig, routeItem.static, filePath);
      },
      methods,
      urlPath,
      pathRegExp: pathToRegexp(urlPath),
      getParams(path) {
        const res = match<{ [k: string]: string }>(urlPath)(path);

        if (res === false) {
          return {};
        }

        return res.params;
      },
    };
  }

  getRouteByUrlPath(urlPath: string, method: string): RouteEntity | null {
    return (
      this.routes.find((r) => this.isSearchedRoute(r, urlPath, method)) || null
    );
  }

  private isSearchedRoute(
    route: RouteEntity,
    path: string,
    method: string
  ): boolean {
    if (route.pathRegExp.test(path) === false) {
      return false;
    }
    if (route.methods) {
      const isIncludeMethod = route.methods
        .toLowerCase()
        .split('|')
        .includes(method.toLowerCase());

      return isIncludeMethod;
    }
    return true;
  }

  toCurrentRoute(ctx: Application.Context, route: RouteEntity): CurrentRoute {
    return {
      name: route.name,
      path: route.path,
      query: ctx.query,
      get params() {
        return route.getParams(ctx.path);
      },
      resolveRoute: this.resolveRoute.bind(this),
      get staticFile() {
        return route.getFilePath(ctx.request.url);
      }
    };
  }

  private resolveRoute(
    name: string,
    params: { [k: string]: string | number } = {}
  ): string | null {
    const route = this.routes.find((item) => {
      return item.name === name;
    });
    if (!route) {
      return null;
    }
    const toPath = compile(route.path, { encode: encodeURIComponent });

    return toPath(params);
  }
}
