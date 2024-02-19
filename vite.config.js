import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import checker from 'vite-plugin-checker'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
const isDev = process.env.NODE_ENV === 'development'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        checker({
            typescript: true
        }),
        vue(),
        vueJsx(),
        createSvgIconsPlugin({
            // 指定缓存文件
            iconDirs: [path.resolve(process.cwd(), 'src/svgIcon/svg')],
            // 指定symbolId格式
            symbolId: 'icon-[dir]-[name]'
        })
    ],
    base: './',
    build: {
        rollupOptions: {
            output: {
                chunkFileNames: 'static/js/chunk-[name].js',
                entryFileNames: 'static/js/[name].js',
                assetFileNames(assetInfo) {
                    const extname = path.extname(assetInfo.name)
                    if (extname === '.css') {
                        return 'static/css/[name].css'
                    }
                    return 'static/[name].[ext]'
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {},
                javascriptEnabled: true
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '/DreamWeb': {
              target: 'http://192.168.9.251:9090',
              changeOrigin: true,
              pathRewrite: {
                '^DreamWeb/': 'DreamWeb/'
              }
            }
          }
    }
})
