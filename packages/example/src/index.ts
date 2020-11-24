import Koa from 'koa';
import { makeRouter } from '@avil13/koa-router';

(async () => {
  const app = new Koa();

  app.use(await makeRouter('./router-config.yaml'));

  app.listen(3000);
})();
