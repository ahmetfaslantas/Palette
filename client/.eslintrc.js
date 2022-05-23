module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "plugins": [
    "react",
  ],
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
      },
    ],
    "react/jsx-indent": [
      "error",
      2,
    ],
    "linebreak-style": [
      "error",
      "windows",
    ],
    "quotes": [
      "error",
      "double",
    ],
    "semi": [
      "error",
      "always",
    ],
    "react/react-in-jsx-scope": [
      "off",
    ],
    "no-console": [
      "error",
    ],
    "no-warning-comments": [
      "warn",
      {
        "terms": [
          "todo",
          "fixme",
        ],
        "location": "anywhere",
      },
    ],
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "functions": "never",
      },
    ],
    "max-len": [
      "error",
      {
        "code": 110,
      },
    ],
  },
  "settings": {
    "react": {
      "version": "999.999.999",
    },
  },
};
