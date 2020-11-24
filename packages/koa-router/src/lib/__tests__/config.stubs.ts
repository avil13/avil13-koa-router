export const simple = `
routes:
  - name: Test
    path: /
    controller: blog::getArticles
`;
export const simple2 = `
routes:
  - name: Test1
    path: /1
    controller: blog::getFirst

  - name: Test2
    path: /2
    controller: blog::getSecond
`;

export const full = `
routes:
  - name: ShowBlogItem
    prefix: /blog
    path: /:id
    controller: blog::getArticle
    methods: GET|HEAD
    middleware:
      - is_guest
      - is_auth
      - is_admin
    requirements:
      id: '\d+'
    response:
      header: text/html
      status: 200
    __DEV__:
`;

export const withImport = `
routes:
  - name: Article
    path: /:id
    controller: blog::getArticle

  - prefix: /api
    importConfigPath: './path/to/simple'

  - prefix: /api2
    importConfigPath: './path/to/simple2'
`;

export const subImport0 = `
routes:
  - prefix: /api
    importConfigPath: './sub/1'
`;

export const subImport1 = `
routes:
  - prefix: /user
    importConfigPath: './sub/2'
`;
export const subImport2 = `
routes:
  - name: UserItem
    path: /me
    controller: user::getUser

  - prefix: /list
    importConfigPath: './sub/3'
`;
export const subImport3 = `
routes:
  - name: /list
    importConfigPath: './sub/3'
`;
