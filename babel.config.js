module.exports = function(api) {
  api.cache(true);

  const presets = ['@babel/preset-env', '@babel/preset-react'];
  const plugins = [
    require('@babel/plugin-proposal-class-properties'),
    '@babel/plugin-proposal-optional-chaining',
    'transform-runtime',
    'syntax-dynamic-import',
    'babel-plugin-transform-export-extensions',
    'transform-es2015-modules-commonjs',
  ];
  return {
    presets,
    plugins,
    sourceType: 'unambiguous',
  };
};
