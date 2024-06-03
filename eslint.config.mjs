import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended, {
        rules: {
            'no-console': 'warn',

            // To Avoid Bugs
            'no-undef': 'error',
            'semi': 'error',
            'semi-spacing': 'error',

            //Best Practices
            'eqeqeq': 'warn',
            'no-invalid-this': 'error',
            'no-return-assign': 'error',
            'no-unused-expressions': ['error', { 'allowTernary': true }],
            'no-useless-concat': 'error',
            'no-useless-return': 'error',
            'no-constant-condition': 'warn',
            'no-unused-vars': ['warn', { 'argsIgnorePattern': 'req|res|next|__' }],

            // Enhance Readability
            'indent': ['error', 2, { 'SwitchCase': 1 }],
            'no-mixed-spaces-and-tabs': 'warn',
            'spaces-before-blocks': 'error',
            'space-in-params': 'error',
            'space-infix-ops': 'error',
            'space-unary-ops': 'error',
            'quotes': ['error', 'single'],
            // 
            'max-len': ['error', { 'code': 200 }],
            'max-lines': ['error', { 'max': 500 }],
            'keyword-spacing': 'error',
            'multiline-ternary': ['error', 'never'],
            'no-mixed-operators': 'error',
            //
            'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
            'no-whitespace-before-property': 'error',
            'nonblock-statement-body-position': 'error',
            'object-property-newline': ['error',
                { 'allowAllPropertiesOnSameLine': true }
            ],

            // ES6
            'arrow-spacing': 'error',
            'no-confusing-arrows': 'error',
            'no-duplicate-imports': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-const': 'error',
            'prefer-template': 'error',

        }

    }];

// // Indentation : enforce consistent Indentation
// 'indent' : ['error', 2],
// //SemiColon :enforce semicolons at the of statements
// 'semi' : ['error', 'always'],
//  //Qoutes :enforce single Quotes for string;
// 'quotes' : ['error', 'single'],

// 'no-used-vars': 'error',

// 'prefer-arrow-callback': 'error',

// 'arrow-parens': ['error', 'always'],

// 'object-shorthand': ['error', 'always'],

// 'no-eval': 'error',

// 'no-sync': 'error',
