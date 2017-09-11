var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './html/app.jsx',
    module: {
        loaders: [
			{
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
        ]
    },
    output: {
        path: path.resolve(__dirname, 'html'),
        filename: 'bundle.js'
    }
};