import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

const extensions = [
  ".js",
  ".ts"
];

export default {
  input: "./src/XAPI.ts",
  plugins: [
    resolve({
      extensions: extensions
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      extensions: extensions
    })
  ],
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "XAPI"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ]
};
