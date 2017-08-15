const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		main: path.join(__dirname, 'src', 'index.js'),
		vendor: ['react',  'react-dom'],
	},
	output: {
		filename: 'main.[hash].js',
		path: path.join(__dirname, 'build'),
	},
	module: {
		rules: [
		{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: [
			{
				loader: 'babel-loader',
				options: {
					babelrc: false,
					presets: ['react', 'es2015', 'env', 'stage-0'],
					plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-runtime'],
				},
			},
			],
		},
		{
			test: /\.css$/,
			include: path.join(__dirname, 'src', 'libs'),
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader'
			}),
		},
		{
			test: /\.css$/,
			exclude: path.join(__dirname, 'src', 'libs'),
			loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]',
		},
		{
			test: /\.(png|svg|jpg|gif)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
            name: 'assets/[name].[ext]',
          }
				}
			],
		},
		{
			test: /\.json/,
			use: [
				{
					loader: 'file-loader',
				}
			],
		},
		{
			test: /\.(eot|ttf|woff|woff2)$/,
			loader: 'file-loader?name=fonts/[name].[ext]',
		},
		],
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.bundle.js',
		}),
		new HtmlWebpackPlugin({
			template: './src/tabSpork.html',
			filename: 'tabSpork.html',
		}),
		new ExtractTextPlugin('bundle.css'),
		new WebpackCleanupPlugin(),
		new CopyWebpackPlugin([
			{ from: __dirname + '/src/manifest.json', to: __dirname + '/build'},
			{ from: __dirname + '/src/assets', to: __dirname + '/build/assets'},
		]),
	],
}
