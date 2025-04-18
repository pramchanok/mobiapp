module.exports = {
	root: true,
	env: {
		node: true,
		es6: true
	},
	extends: [
		"plugin:vue/vue3-recommended",
		"eslint:recommended",
		"plugin:prettier/recommended"
	],
	parserOptions: {
		parser: "@babel/eslint-parser",
		requireConfigFile: false
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"vue/multi-word-component-names": "off",
		"indent": ["error", 4],
		"vue/html-indent": ["error", 4],
		"semi": ["error", "always"],
		"quotes": ["error", "double"],
		"prettier/prettier": ["error", { "tabWidth": 4 }]
	}
};
