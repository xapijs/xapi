/* istanbul ignore file */

const testIf = (condition: boolean): jest.It => (condition ? test : test.skip);

const isNode = (): boolean => typeof window === "undefined";

export { testIf, isNode };
