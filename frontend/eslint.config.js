import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        ignores: ['dist'], // Ignore built files
    },
    {
        files: ['**/*.{ts,tsx,js,jsx}'], // Apply to TypeScript and JavaScript files
        languageOptions: {
            ecmaVersion: 2021, // Support modern ECMAScript
            sourceType: 'module', // Enable ES modules
            globals: globals.browser, // Add browser globals
            parser: tsParser, // Use TypeScript parser for all supported files
        },
        plugins: {
            react, // React plugin for linting JSX
            'react-hooks': reactHooks, // React hooks linting plugin
            '@typescript-eslint': tsPlugin, // TypeScript linting plugin
        },
        rules: {
            ...react.configs.recommended.rules, // Add recommended React rules
            ...reactHooks.configs.recommended.rules, // Add recommended React hooks rules
            ...tsPlugin.configs.recommended.rules, // Add recommended TypeScript rules
            '@typescript-eslint/no-unused-vars': 'warn', // Warn for unused variables
            'react/react-in-jsx-scope': 'off', // Disable React in scope for React 17+
            'react/jsx-uses-react': 'off', // Disable React usage checks for React 17+
        },
        settings: {
            react: {
                version: 'detect', // Auto-detect React version
            },
        },
    },
];
