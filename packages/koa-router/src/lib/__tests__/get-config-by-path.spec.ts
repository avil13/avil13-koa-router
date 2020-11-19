import * as stubs from './config.stubs';

jest.mock('util', () => {
  return {
    __esModule: true,
    promisify() {
      return (configContent: string) => {
        if (configContent === './path/to/simple') {
          configContent = stubs.simple;
        }
        if (configContent === './path/to/simple2') {
          configContent = stubs.simple2;
        }
        return Promise.resolve(configContent);
      };
    },
  };
});

import { getConfigByPath } from '../get-config-by-path';

describe('create-config-by-path', () => {
  it('simple', async () => {
    const conf = await getConfigByPath(stubs.simple);

    expect(conf).toEqual({
      routes: [{ controller: 'blog::getArticles', name: 'Test', path: '/' }],
    });
  });

  it('importConfigPath', async () => {
    const conf = await getConfigByPath(stubs.withImport);

    expect(conf).toEqual({
      routes: [
        {
          name: 'Article',
          path: '/:id',
          controller: 'blog::getArticle',
        },
        {
          name: 'Test',
          path: '/',
          controller: 'blog::getArticles',
          prefix: '/api',
        },
        {
          name: 'Test1',
          path: '/1',
          controller: 'blog::getFirst',
          prefix: '/api2',
        },
        {
          name: 'Test2',
          path: '/2',
          controller: 'blog::getSecond',
          prefix: '/api2',
        },
      ],
    });
  });
});
