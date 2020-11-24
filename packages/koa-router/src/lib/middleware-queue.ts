import Application from 'koa';

import { RouterMiddleware } from '../types';

export const middlewareQueue = async (
  ctx: Application.Context,
  items: RouterMiddleware[]
) => {
  let isResult: ReturnType<RouterMiddleware> = true;

  for (const item of items) {
    if (isResult !== true) {
      break;
    }
    isResult = await item(ctx);
  }
  return isResult;
};
