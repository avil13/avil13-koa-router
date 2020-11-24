import { RouteController } from '@avil13/koa-router';

export const index: RouteController = (ctx) => {
  console.log('=>', ctx.route);
  return 'false';
};

export const user: RouteController = (ctx) => {
  console.log('=>', ctx.route.params);

  ctx.status = 201;
  ctx.body = `!!!!!:${ctx.route.params.name}`;

  return `Name: ${ctx.route.params.name}`;
};
