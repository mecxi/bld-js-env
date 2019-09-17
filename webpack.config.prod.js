import path from 'path';
import  webpack from 'webpack'; // for additional webpack feature
import HtmlWebpackPlugin from 'html-webpack-plugin'; // for bundling html
import WebpackMd5hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  entry: {
    vendor: path.resolve(__dirname, 'src/vendor'),
    main: path.resolve(__dirname, 'src/index')
  },
  target: 'web',
  output:{
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    // Mimify JS
    new webpack.optimize.UglifyJsPlugin(),
    // Eliminae duplicate packages when generating bundle
    new webpack.optimize.DedupePlugin(),
    // Create HTML file that includes reference to bundled JS.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true,
      trackJSToken: '',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedudantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    // Use CommonsChunkPlugin to create a separate bundle
    // of vendor libraries so that they're cached separately.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // Hash the files using MD5 so that their names change when the content changes.
    new WebpackMd5hash(),
    // Generate an external css file with a hash in the filename
    new ExtractTextPlugin('[name].[contenthash].css')
  ],
  module: {
    loaders:[
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
      {test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap')}
    ]
  }
}
