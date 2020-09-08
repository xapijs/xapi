import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import pkg from "./package.json";

const input = "./src/XAPI.ts";

const extensions = [
  ".js",
  ".ts"
];

const resolveOptions = {
  extensions: extensions
};

const babelPluginOptions = {
  babelHelpers: "bundled",
  extensions: extensions
};

export default [{
  input: input,
  plugins: [
    resolve({
      ...resolveOptions,
      browser: true
    }),
    commonjs(), // Used for Axios import
    babel(babelPluginOptions)
  ],
  output: [
    {
      file: pkg.browser,
      format: "umd",
      name: "XAPI"
    },
    {
      file: pkg.module,
      format: "esm",
      exports: "default"
    }
  ]
}, {
  input: input,
  plugins: [
    resolve({
      ...resolveOptions,
      browser: false
    }),
    commonjs(), // Used for Axios import
    json(),
    babel(babelPluginOptions)
  ],
  external: ["http", "https", "url", "zlib", "stream", "assert", "tty", "util", "os"],
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "default"
    }
  ]
}];
