module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        'modules': 'false',
        'useBuiltIns': 'usage',
        'targets': '> 0.25%, not dead',
      }
    ]
  ],
  env: {
    test: {
      presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
      plugins: [
        "babel-plugin-transform-import-meta",
        "transform-es2015-modules-commonjs"
      ],
    },
  },
};
