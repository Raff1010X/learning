module.exports = {
    env: {
        browser: false,
        commonjs: true,
        es2021: true,
    },
    extends: ['airbnb-base', 'prettier', 'plugin:node/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    plugins: ['prettier', 'node'],
    rules: {
        //endOfLine: 'auto',
        //'prettier/prettier': 'error',
        'spaced-comment': 'off',
        'no-console': 'off',
        'consistent-return': 'off',
        'func-names': 'off',
        'object-shorthand': 'off',
        'no-process-exit': 'off',
        'no-param-reassign': 'off',
        'no-return-await': 'off',
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'prefer-destructuring': ['error', { object: true, array: false }],
        'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|val' }],
    },
};
