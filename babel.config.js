module.exports = function(api) {
	api.cache(true);

	const presets = [
		"@babel/preset-react",
		"module:metro-react-native-babel-preset"
	];
	const plugins = [
		"@babel/plugin-transform-flow-strip-types",
		"@babel/plugin-proposal-class-properties"
	];

	return {
		presets,
		plugins
	};
};
