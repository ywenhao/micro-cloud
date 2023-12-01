import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { minify } from 'terser'
import { outDir } from '../../build/utils/paths'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: './src',
      copyDtsFiles: true,
      insertTypesEntry: true,
      /**
       * 是否将 '.vue.d.ts' 文件名转换为 '.d.ts'
       *
       * @default false
       */
      cleanVueFileName: true,
      /**
       * 是否将动态引入转换为静态
       *
       * 当开启打包类型文件时强制为 true
       *
       * 例如将 'import('vue').DefineComponent' 转换为 'import { DefineComponent } from "vue"'
       *
       * @default false
       */
      staticImport: true,
      // outputDir: [resolve(outDir, 'es'), resolve(outDir, 'lib')],
      outputDir: [resolve(outDir, 'components')],
      // //指定使用的tsconfig.json为我们整个项目根目录下,如果不配置,你也可以在components下新建tsconfig.json
      // tsConfigFilePath: '../../tsconfig.build.json'
      beforeWriteFile(filepath: string, content: string) {
        return {
          filepath,
          content: content.replace(/@vc-material/g, 'vc-material')
        }
      }
    })
    // {
    //   name: 'comps',
    //   resolveId(source) {
    //     if (!source.startsWith('@vc-material')) return;
    //     return {
    //       id: source.replaceAll('@vc-material', 'vc-material'),
    //       external: 'absolute'
    //     };
    //   }
    // }
  ],
  build: {
    //打包文件目录
    outDir: 'es',
    //压缩
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
      format: { comments: false }
    },
    rollupOptions: {
      //忽略打包vue文件
      external: [
        'vue',
        'vue-router',
        '@arco-design/web-vue',
        /\.scss/,
        /\.less/,
        '@vueuse/core',
        'lodash-es',
        'fingerprintjs2',
        'fingerprintjs'
      ],
      input: ['index.ts'],
      output: [
        {
          //打包格式
          format: 'es',
          //打包后文件名
          // entryFileNames: '[name].mjs',
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
          //配置打包根目录
          // dir: resolve(outDir, 'es')
          dir: resolve(outDir, 'components')
        }
        // {
        //   //打包格式
        //   format: 'cjs',
        //   //打包后文件名
        //   entryFileNames: '[name].js',
        //   //让打包目录和我们目录对应
        //   preserveModules: true,
        //   preserveModulesRoot: 'src',
        //   exports: 'named',
        //   //配置打包根目录
        //   dir: resolve(outDir, 'lib')
        // }
      ]
    },
    lib: {
      entry: './index.ts'
    }
  }
})
