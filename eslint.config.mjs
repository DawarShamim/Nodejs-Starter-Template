import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended, {

    }

];

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
