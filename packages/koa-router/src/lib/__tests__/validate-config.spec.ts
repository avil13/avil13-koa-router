import { ConfigEntity } from './../../types';
import { validateConfig } from '../validate-config';
import * as stubs from './config.stubs';

describe('validateConfig', () => {
  it('good config', () => {
    const res = validateConfig(stubs.simpleJson);
    expect(res).toBe(true);
  });

  it('bad config', () => {
    const res = validateConfig(stubs.badJson as ConfigEntity);
    expect(JSON.stringify(res)).toContain(
      `should have required property 'controller'`
    );
  });

  it('with middleware', () => {
    const res = validateConfig(stubs.withMiddlewareJson);
    expect(res).toBe(true);
  });
});
