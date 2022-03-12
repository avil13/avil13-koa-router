import { describe, expect, it, vi } from 'vitest';
import { getConfigByPath } from '../get-config-by-path';
import * as stubs from './config.stubs';

vi.mock('fs', () => {
  return {
    __esModule: true,
    readFileSync(configContent: string) {
      return configContent;
    },
  };
});

describe('getConfigByPath', () => {
  it('simple', async () => {
    const conf = getConfigByPath(stubs.simpleYaml);
    expect(conf).toEqual(stubs.simpleJson);
  });
});
