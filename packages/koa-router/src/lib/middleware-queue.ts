import { RouterContext, RouterMiddleware } from '../types';

export const middlewareQueue = async (
  ctx: RouterContext,
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
