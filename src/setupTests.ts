import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Make sure we're exposing the globals for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var describe: typeof import('vitest')['describe'];
  // eslint-disable-next-line no-var
  var it: typeof import('vitest')['it'];
  // eslint-disable-next-line no-var
  var expect: typeof import('vitest')['expect'];
  // eslint-disable-next-line no-var
  var beforeEach: typeof import('vitest')['beforeEach'];
  // eslint-disable-next-line no-var
  var afterEach: typeof import('vitest')['afterEach'];
  // eslint-disable-next-line no-var
  var vi: typeof import('vitest')['vi'];
}