/** @type {import('tailwindcss').Config} */
module.exports = {
  separator: '__', // 如果是小程序项目需要设置这一项，将 : 选择器替换成 __，之后 hover:bg-red-500 将改为 hover__bg-red-500
  corePlugins: {
    // 预设样式
    preflight: false, // 一般uniapp都有预设样式，所以不需要tailwindcss的预设
    // 以下功能小程序不支持
    space: false,
    divideWidth: false,
    divideColor: false,
    divideStyle: false,
    divideOpacity: false,
  },
  content: [
    './src/pages/**/*.{vue,js,ts}',
    './src/components/**/*.{vue,js,ts}',
    './src/main.{js,ts}',
    './src/App.vue',
    './src/index.html'
  ],
  theme: {
    extend: {
      // 自定义样式
    },
  },
  plugins: []
}