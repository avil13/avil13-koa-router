import Application from 'koa';

export interface CurrentRoute {
  readonly name: string;
  readonly path: string;
  readonly params: { [key: string]: string };
  readonly query: { [key: string]: string | string[] | undefined };
  resolveRoute(
    name: string,
    params?: {
      [k: string]: string | number;
    }
  ): string | null;
}

/* eslint-disable @typescript-eslint/ban-types */
export type RouterContext = Application.Context & {
  route: CurrentRoute;
};
/* eslint-enable @typescript-eslint/ban-types */

export type RouteControllerResult =
  | undefined
  | string
  | number
  | { [key: string]: any }
  | RouterResponse;

export type RouteController = (
  ctx: RouterContext
) => RouteControllerResult | Promise<RouteControllerResult>;

export type RouterMiddleware = (
  ctx: RouterContext
) => boolean | RouterResponse | Promise<boolean | RouterResponse>;

export interface RouteEntity extends RouteConfigItem {
  readonly name: string;
  readonly urlPath: string;
  readonly pathRegExp: RegExp;
  getParams(path: string): { [key: string]: string };
}

export interface RouterResponse {
  status?: number;
  body?: string | number | { [key: string]: any };
  header?: any;
}

export interface RouteConfigItem {
  name: string;
  controller: string;
  path: string;
  prefix?: string;
  methods?: string;
  middleware?: string[];
  // requirements?: {
  //   [key: string]: RegExp;
  // };
  response?: {
    header?: string;
    status?: number;
  };
}

export interface ConfigEntity {
  options: {
    middlewarePath: string | './middleware';
    controllerPath: string | './controller';
  };
  middleware: { [key: string]: string };
  routes: RouteConfigItem[];
}
