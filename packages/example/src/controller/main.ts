import { RouteController } from '@avil13/koa-router';

export const index: RouteController = (ctx) => {
  console.log('=> index:', ctx.route);
  return 'Hello world!!!';
};

export const user: RouteController = (ctx) => {
  const params = ctx.route.params

  console.log('=> user:', JSON.stringify(params));

  ctx.status = 201;
  ctx.body = `RouteController( ${params.name} )`;

  return `Name: ${params.name}`;
};
