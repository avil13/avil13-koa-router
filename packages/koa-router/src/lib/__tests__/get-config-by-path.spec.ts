import * as stubs from './config.stubs';

jest.mock('fs', () => {
  return {
    __esModule: true,
    readFileSync(configContent: string) {
      return configContent;
    },
  };
});

import { getConfigByPath } from '../get-config-by-path';

describe('getConfigByPath', () => {
  it('simple', async () => {
    const conf = getConfigByPath(stubs.simpleYaml);
    expect(conf).toEqual(stubs.simpleJson);
  });
});
