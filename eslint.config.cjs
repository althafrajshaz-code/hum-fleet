const react = require('eslint-plugin-react');

module.exports = [
  {
    files: ["**/*.jsx"],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        alert: "readonly",
        navigator: "readonly"
      }
    },
    rules: {
      "no-undef": "error"
    }
  }
];
