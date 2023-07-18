const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

let baseConfig = {
    target: 'web',
    mode: 'production',
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
    }
};

let moduleConfig= Object.assign({}, baseConfig, {
    name: 'blazorStreamSaver',
    entry: "./Npm/src/blazorStreamSaver.ts",
    experiments: {
        outputModule: true,
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: [
                    /node_modules/,
                    /serviceWorker\.ts$/
                ]
            },
            {
                test: /serviceWorker\.ts$/,
                use: 'ignore-loader'
            }
        ],
    },
    output: {
        path: path.resolve(__dirname, 'wwwroot'),
        filename: 'blazorStreamSaver.bundle.js',
        library: {
            type: 'module'
        }
    }
});

let serviceWorkerConfig= Object.assign({}, baseConfig, {
    name: 'serviceWorker',
    entry: "./Npm/src/serviceWorker.ts",
    module: {
        rules: [
            {
                test: /serviceWorker\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
       path: path.resolve(__dirname, 'wwwroot'),
       filename: 'serviceWorker.js',
    }
});

module.exports = [serviceWorkerConfig, moduleConfig];
