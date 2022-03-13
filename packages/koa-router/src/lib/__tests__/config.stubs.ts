export const simpleYaml = `
routes:
  - name: Test
    path: /
    controller: blog::getArticles
`;

export const simpleJson = {
  middleware: {},
  options: {
    controllerPath: './controller',
    middlewarePath: './middleware',
  },
  routes: [
    {
      controller: 'blog::getArticles',
      name: 'Test',
      path: '/',
    },
  ],
};

//
export const withMiddlewareJson = {
  middleware: {},
  options: {
    controllerPath: './controller',
    middlewarePath: './middleware',
  },
  routes: [
    {
      name: 'UserItem',
      path: '/user',
      controller: 'user::getUser',
      methods: 'GET|HEAD',
      middleware: ['is_auth'],
    },
  ],
};

//
export const badJson = {
  routes: [
    {
      name: 'bad-name',
    },
    {
      name: 'bad-name',
      controller: 'callback',
    },
    {
      name: 'bad-name',
      path: '/',
      controller: 'callback',
    },
  ],
};
//

export const fullYaml = `
routes:
  - name: Test1
    path: /1
    controller: blog::getFirst

  - name: ShowBlogItem
    prefix: /blog
    path: /:id
    controller: blog::getArticle
    methods: GET|HEAD
    middleware:
      - is_guest
      - is_auth
      - is_admin
    response:
      header: text/html
      status: 200
`;

export const staticRouteJson = {
  middleware: {},
  options: {
    controllerPath: './controller',
    middlewarePath: './middleware',
  },
  routes: [
    {
      name: 'StaticItem',
      path: '/',
      static: '/public'
    },
  ],
};
