import path from 'path';
import { defineConfig } from 'vite';
import terser from '@rollup/plugin-terser';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
    build: {
        lib: {
            name: 'blazor-stream-saver',
            entry: path.join(__dirname, "Npm/src/blazorStreamSaver.ts"),
            fileName: (format) => `blazorStreamSaver.${format}.js`
        },
        rollupOutputOptions: {
            plugins: [
                terser({
                    compress: {
                        drop_console: false,
                        passes: 3
                    },
                    mangle: true
                }),
                viteCompression({
                    algorithm: 'brotliCompress',
                    ext: 'br'
                }),
                viteCompression({
                    algorithm: 'gzip',
                    ext: 'gz',
                    compressionOptions: {
                        params: {
                            quality: 11
                        }
                    }
                })
            ]
        }
    }
});