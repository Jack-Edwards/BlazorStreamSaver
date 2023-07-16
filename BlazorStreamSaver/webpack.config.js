const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    name: 'blazorStreamSaver',
    target: 'web',
    mode: 'production',
    experiments: {
        outputModule: true,
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: false,
                        passes: 3
                    },
                    mangle: true
                }
            }),
        ],
    },
    output: {
        path: path.resolve(__dirname, 'wwwroot'),
        filename: 'blazorStreamSaver.bundle.js',
        library: {
            type: 'module'
        }
    },
    plugins: [
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/
        }),
        new CompressionPlugin({
            algorithm: 'brotliCompress',
            compressionOptions: { level: 11 },
            test: /\.(js|css|html|svg)$/
        })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
}
