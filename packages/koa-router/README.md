# @avil13/koa-router

Koa-router, with yaml configuration and care of the developer.

---

```ts
import Koa from 'koa';
import { makeRouter } from '@avil13/koa-router';

const app = new Koa();

app.use(
  makeRouter('./router-config.yaml', {
    idDev: app.env !== 'production',
  })
);

app.listen(3000);
```