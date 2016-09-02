var weight = 100;

function dependencies() {
  return {
    dependencies: {
      'react': '^15.0.0',
      'react-dom': '^15.0.0',
      'react-addons-pure-render-mixin': '^15.0.0'
    },
    devDependencies: {
      'babel': '^6.3.26',
      'babel-core': '^6.3.26',
      'babel-loader' : '^6.2.0',
      'proto-loader': '0.2.0',
      'babel-preset-react': '^6.3.13',
      'babel-preset-es2015': '^6.3.13',
      'babel-preset-stage-0': '^6.3.13',
      'babel-plugin-transform-decorators-legacy': '^1.3.2',
      'babel-plugin-add-module-exports': '^0.1.2',
      'babel-plugin-react-transform': '^2.0.0',
      'expose-loader': '^0.7.1',
      'react-transform-hmr' : '^1.0.1',
      'react-transform-catch-errors': '^1.0.0',
      'redbox-react': '^1.2.0'
    }
  };
}

function config(settings, require) {
  var fs = require('fs');
  var path = require('path');
  var babelSettings = {};
  var tsConfig = {};

  var CWD = path.resolve('./');

  if (fs.existsSync(CWD + '/.babelrc')) {
    var babelrc = fs.readFileSync(CWD + '/.babelrc');
    babelSettings = JSON.parse(babelrc);
  }

  if (fs.existsSync(CWD + '/tsconfig.json')) {
    var tsConfigData = fs.readFileSync(CWD + '/tsconfig.json');
    tsConfig = JSON.parse(tsConfigData);
  }

  if (!tsConfig.compilerOptions) {
    tsConfig.compilerOptions = {};
  }

  if (typeof tsConfig.compilerOptions.target === 'undefined') { tsConfig.compilerOptions.target = 'es6'; }
  if (typeof tsConfig.compilerOptions.jsx === 'undefined') { tsConfig.compilerOptions.jsx = 'react'; }
  if (typeof tsConfig.compilerOptions.sourceMap === 'undefined') { tsConfig.compilerOptions.sourceMap = true; }
  if (typeof tsConfig.compilerOptions.experimentalDecorators === 'undefined') { tsConfig.compilerOptions.experimentalDecorators = true; }
  if (typeof tsConfig.compilerOptions.module === 'undefined') { tsConfig.compilerOptions.module = 'commonjs'; }

  if (!tsConfig.exclude) { tsConfig.exclude = []; }
  if (tsConfig.exclude.indexOf('node_modules') < 0) { tsConfig.exclude.push('node_modules'); }
  if (tsConfig.exclude.indexOf('.meteor') < 0) { tsConfig.exclude.push('.meteor'); }

  if (!babelSettings.presets) {
    babelSettings.presets = [];
  }

  if (!babelSettings.plugins) {
    babelSettings.plugins = [];
  }

  if (babelSettings.presets.indexOf('react') < 0) {
    babelSettings.presets.push('react');
  }

  if (babelSettings.presets.indexOf('es2015') < 0) {
    babelSettings.presets.push('es2015');
  }

  if (babelSettings.presets.indexOf('stage-0') < 0 &&
      babelSettings.presets.indexOf('stage-1') < 0 &&
      babelSettings.presets.indexOf('stage-2') < 0 &&
      babelSettings.presets.indexOf('stage-3') < 0) {
    babelSettings.presets.push('stage-0');
  }

  if (settings.babel && settings.babel.plugins) {
    babelSettings.plugins = babelSettings.plugins.concat(settings.babel.plugins);
  }

  if (babelSettings.plugins.indexOf('transform-decorators-legacy') < 0) {
    babelSettings.plugins.push('transform-decorators-legacy');
  }

  if (babelSettings.plugins.indexOf('add-module-exports') < 0) {
    babelSettings.plugins.push('add-module-exports');
  }

  if (settings.isDebug && settings.platform !== 'server' && !IS_TEST) {
    var transforms = [{
      transform: 'react-transform-hmr',
      imports: ['react'],
      locals: ['module']
    }];

    if (settings.babel && !settings.babel.disableRedbox) {
      transforms.push({
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react']
      });
    }

    babelSettings.plugins.push(['react-transform', { transforms: transforms }]);
  }

  var usingMeteorReact = settings.packages.indexOf('react-runtime') >= 0;
  var extensions = ['.js', '.jsx'];
  var loaders = [
    { test: /\/node_modules\/react\/react\.js$/, loader: 'expose?React' },
    { test: /\.jsx?$/, loader: 'babel', query: babelSettings, exclude: /\.meteor|node_modules/ },
    {
        test: /\.proto$/,
        loader: "proto-loader"
    }
  ];

  if (settings.packages.indexOf('webpack:typescript') >= 0) {
    loaders.push({ test: /\.tsx$/, loader: 'babel?' + JSON.stringify(babelSettings) + '!ts?' + JSON.stringify(tsConfig), exclude: /\.meteor|node_modules/ });
    extensions.push('.tsx');
  }

  var externals = {};

  if (settings.isTest || settings.isAppTest) {
    // Support for Enzyme
    externals['react/addons'] = true;
    externals['react/lib/ExecutionEnvironment'] = true;
    externals['react/lib/ReactContext'] = true;
  }

  return {
    loaders: loaders,
    extensions: extensions,
    externals: externals
  };
}
