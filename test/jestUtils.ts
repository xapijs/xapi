const testIf = (condition) => (condition ? test : test.skip);

const isNode = () => typeof window === "undefined";

export { testIf, isNode };
