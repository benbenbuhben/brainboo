import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import babelParser from "@babel/eslint-parser"; // ✅ Import the Babel ESLint parser

export default [
  {
    ignores: ['package.json'],
    files: ["**/*.jsx", "**/*.js"], // ✅ Ensure ESLint applies config to JS and JSX files
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: babelParser, // ✅ Use the imported Babel parser
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"], // ✅ Ensure JSX is parsed
        },
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
    },
    rules: {
      "import/no-unresolved": "error",
      "import/named": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
