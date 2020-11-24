import * as stubs from './config.stubs';

jest.mock('util', () => {
  return {
    __esModule: true,
    promisify() {
      return (configContent: string) => {
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
});
