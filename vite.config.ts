import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'
// https://vitejs.dev/config/
export default defineConfig(({ command,mode }) => {
  //获取各种环境下对应的变量
  const env = loadEnv(mode,process.cwd())
  return {
    plugins: [vue(),
      viteMockServe({
        mockPath: 'moke',
        enable: true,
      }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src")
      //   '@': path.resolve(__dirname, 'src'),
      // 'assets': path.resolve(__dirname, 'src/assets')
      }
    },
    css: {
      preprocessorOptions: {
        javascriptEnabled: true,
        additionalData: '@import "./src/styles/variable.scss";'
      }
    },
    //代理跨域
    server:{
      proxy:{
        [env.VITE_APP_BASE_API]:{
          // 获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //  需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }

      }
    }
  }
})
