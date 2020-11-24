import Application from 'koa';

export type RouteControllerResult =
  | undefined
  | string
  | number
  | { [key: string]: any }
  | RouterResponse;

export type RouteController = (
  ctx: Application.Context
) => RouteControllerResult | Promise<RouteControllerResult>;

export type RouterMiddleware = (
  ctx: Application.Context
) => boolean | RouterResponse | Promise<boolean | RouterResponse>;

export interface RouteEntity extends RouteConfigItem {
  readonly urlPath: string;
  readonly pathRegExp: RegExp;
  getParams(path: string): { [key: string]: string };
}

export interface CurrentRoute {
  readonly name: string;
  readonly path: string;
  readonly params: { [key: string]: string };
  readonly query: { [key: string]: string | string[] };
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
