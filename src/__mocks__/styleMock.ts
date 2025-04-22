const handler = {
  get(_: unknown, prop: string) {
    return prop;
  },
};

const proxy = new Proxy({}, handler);

export default proxy;
export const __esModule = true;
