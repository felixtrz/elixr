/* eslint-env node */
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'prettier',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	rules: {
		'sort-imports': [
			'error',
			{
				ignoreCase: false,
				ignoreDeclarationSort: false,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
				allowSeparatedGroups: false,
			},
		],
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ vars: 'all', args: 'all', argsIgnorePattern: '^_' },
		],
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/lines-between-class-members": ['warn', 'always'],
		"no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
		"eol-last": ["error", "always"],
		"no-trailing-spaces": ["error"],
		"semi": ["error", "always"],
		"semi-spacing": ["error", {"before": false, "after": true}],
	},
	root: true,
};
