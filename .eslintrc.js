module.exports = {
    "env": {
        "commonjs": true,
        "node": true,
        "jest": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
    },
    "rules": {
        "indent": [
            "error",
            4,
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
        "max-len": [
            "error",
            {
                "code": 85,
            },
        ],
        "no-console": "error",
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
    },
    "ignorePatterns": [
        "node_modules/",
        "client/",
    ],
};
