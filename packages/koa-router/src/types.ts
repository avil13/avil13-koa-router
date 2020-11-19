export interface CurrentRoute {
  readonly name: string;
  readonly path: string;
  redirect(name: string): void;
}

export interface RouterResponse {
  status?: number;
  body?: string | number;
  header?: any;
}

export type Route = (
  ctx: any
) =>
  | undefined
  | string
  | number
  | RouterResponse
  | Promise<undefined | string | number | RouterResponse>;

export type RouterMiddleware = (
  ctx: any
) => true | RouterResponse | Promise<true | RouterResponse>;
