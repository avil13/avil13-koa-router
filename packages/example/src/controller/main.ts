import { RouteController } from '@avil13/koa-router';

export const index: RouteController = () => {
  return 'Hello from index controller!!!';
};

export const user: RouteController = (ctx) => {
  const params = ctx.route.params;

  console.log('=> user:', JSON.stringify(params));

  ctx.status = 201;
  ctx.body = `RouteController.user( ${params.name} )`;

  return `Name: ${params.name}`;
};
