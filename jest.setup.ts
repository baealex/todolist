import '@testing-library/jest-dom';

import crypto from 'crypto';

Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: crypto.randomUUID,
  },
});

export function mockRequestAnimationFrame() {
  window.requestAnimationFrame = (callback) => {
    callback(0);
    return 0;
  };
}

export function restoreRequestAnimationFrame() {
  delete window.requestAnimationFrame;
}

beforeAll(() => {
  mockRequestAnimationFrame();
});

afterAll(() => {
  restoreRequestAnimationFrame();
});
