import '@testing-library/jest-dom';

if (typeof globalThis.crypto === 'undefined') {
  // @ts-expect-error: Polyfilling crypto for test environment
  globalThis.crypto = {};
}
if (typeof globalThis.crypto.getRandomValues === 'undefined') {
  globalThis.crypto.getRandomValues = async (arr: Uint8Array) => {
  const crypto = await import('crypto');
  return crypto.randomFillSync(arr);
};
}

