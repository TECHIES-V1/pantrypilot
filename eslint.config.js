const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const prettier = require("eslint-plugin-prettier");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends("expo"),
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: ["node_modules/", "agents/", "prompts/", "docs/", "*.md"],
  },
];
