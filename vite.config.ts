// vite.config.js  
import {
  defineConfig
} from 'vite';
process.env.VITE_ASSET_INLINE_LIMIT = '0'
process.env.VITE_LEGACY_PROXY = 'true'
import uni from '@dcloudio/vite-plugin-uni';
import {
  UnifiedViteWeappTailwindcssPlugin as uvwt
} from 'weapp-tailwindcss/vite';

const isH5 = process.env.UNI_PLATFORM === "h5";
const isApp = process.env.UNI_PLATFORM === "app";
const WeappTailwindcssDisabled = isH5 || isApp;

/** ==== 处理 tailwind cli 的自动启动和打包 ==== */
const child_process = require('child_process')
let tailwindMode = process.env.NODE_ENV

// 输出  
console.log(`[tailwindcss] 开始${tailwindMode == 'production' ? '生产环境打包' : '开发模式监听'}`);
child_process.exec(
  // 这里指令对应 package.json 中的 npm scripts  
  tailwindMode == 'production' ?
    'npm run tailwind-build' :
    'npm run tailwind-dev', {
  cwd: __dirname, // 切换目录到当前项目，必须  
},
  (error, stdout, stderr) => {
    // tailwind --watch 是一个持久进程，不会立即执行回调  
    // process.stdout.write('tailwind success')  
    if (error) {
      console.error('[tailwindcss] 异常，请检查');
      console.error(error);
      console.error(stdout);
      console.error(stderr);
    }
    if (tailwindMode == 'production') {
      console.log('[tailwindcss] 生产环境打包完成');
    }
  })

export default defineConfig({
  build: {
    minify: false // 关闭压缩
  },

  plugins: [uni(), uvwt({
    disabled: WeappTailwindcssDisabled,
    tailwindcssBasedir: __dirname,

  }),

  ]
});
