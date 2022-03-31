# @avil13/koa-router

Koa-router, with yaml configuration and care of the developer.

[Example of project](https://github.com/avil13/avil13-koa-router/blob/master/packages/example/)

---

### Install

```bash
npm install koa @avil13/koa-router
```

### Code examples:

```ts

import Koa from 'koa';
import { makeRouter } from '@avil13/koa-router';
import { join } from 'path';

const PORT = 3000;

const app = new Koa();

const pathToConfig = join(__dirname, 'router-config.yaml');

app.use(makeRouter({
  pathToConfig,
  koaBody: { // Now here out of the box
    multipart: true,
    urlencoded: true,
  }
));

app.listen(PORT);

console.log(`http://localhost:${PORT}/`);

```

> If you want to use validation in a YAML file, I recommend that you set [redhat.vscode-yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

## router-config.yaml

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/avil13/avil13-koa-router/master/packages/koa-router/src/avil13-koa-router-json-schema/schema.json

options:                            # optional
  middlewarePath: ./middleware      # default "middleware"
  controllerPath: ./controller      # default "controller"

middleware:
  is_auth: is-auth.middleware::checkAuth  # path to file "./middleware/is-auth.middleware.ts"
  is_admin: is-admin.middleware           # path to file "./middleware/is-admin.middleware.ts"

routes:
  # simplest example with required params
  - name: BlogList
    path: /blog
    controller: blog::getArticleList # path to file ./controller/blog.ts"

  - name: ShowBlogItem            # alias, available via "ctx.router.name"
    prefix: /blog
    path: /:id                    # => /blog/:id   - since there is a prefix
    controller: blog::getArticle  # In the package from "options.controllers" in the "blog.ts " using the "getArticle" function `export const getArticle =(...) => {...}`
    methods: GET|HEAD             # default all 'GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'
    middleware:
      - is_auth
      - is_admin
    response:
      header: text/html
      status: 200

  # /download/(.*) - is subpath of /(.*)
  # So we put it in early.
  - name: StaticDownload
    path: /download/(.*)
    static: ./public
    download: true

  # Static files
  - name: Static
    path: /(.*)
    static: ./public          # path to static folder
```


## Route example
```ts
// ./controller/blog.ts

import { RouteController } from '@avil13/koa-router';

export const getArticleList: RouteController = (ctx) => {
  return [
    'Hello world!!!',
    'Daily news'
  ];
};

export const getArticle: RouteController = (ctx) => {
  const id = ctx.route.params.id;
  return `Article id ${ id }`;
};
```

## Middleware example

Not to be confused with Middleware for the main application.

This is the Middleware for the router.

```ts
// ./middleware/is-auth.middleware.ts
import { RouterMiddleware } from '@avil13/koa-router';

export const checkAuth: RouterMiddleware = (ctx) => {
  // check cookies or JWT ...
  if (isNotAuth) {
    return false;
  }

  return true; // is valid
}
```

# CLI

You can use the CLI helpers.

```sh
# example
yarn ts-node ./src/index.ts \ # path to your server script
                  route:list  # display the current Routes
```

### `route:list`
  - You can see the current routers
