const { override, addBabelPlugins } = require('customize-cra');

module.exports = override(
	...addBabelPlugins(
		"transform-class-properties",
		"syntax-decorators"
	)
);