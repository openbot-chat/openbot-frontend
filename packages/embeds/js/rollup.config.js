import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import external from 'rollup-plugin-peer-deps-external'
import { babel } from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace';
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import json from '@rollup/plugin-json'

process.env.NODE_ENV = 'production';

// 像 @openbot/lib 这种 workspace 的包，不可以放在 dependencies，只能放在 devDependencies
// 像 @openbot/lib 这种 private 的 workspace 包，必须 inline ，不能作为 external
const externalDependencies = [
  /@babel/,
  "@fortaine/fetch-event-source",
  "@openbot/aibot-uikit",
  "@react-three/drei",
  "@react-three/fiber",
  "@readyplayerme/visage",
  "component-register",
  "nanoid",
  "react-error-boundary",
  "three",
  "react-player",
];

// 这里要加上 .js，否则 @openbot/aibot-uikit 的 external 依赖是 js 的话 unresolved dependency
const extensions = ['.ts', '.tsx', '.js']

const reactImportEsBundle = {
  input: './src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
    inlineDynamicImports: true,
  },
  external: externalDependencies,
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({ extensions }),
    // Remove peer-dependencies from final bundle
    external(),
    commonjs(),
    typescript(),
    typescriptPaths({ preserveExtensions: true }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/env'],
      plugins: ['@babel/plugin-transform-runtime'],
      extensions,
    }),
    postcss({
      plugins: [autoprefixer(), tailwindcss()],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: true,
      inject: false,
    }),
  ],
};

const webFullBundle = ({ min } = { min: false }) => ({
  input: './src/web.ts',
  output: {
    file: 'dist/embeds.js',
    format: 'es',
    inlineDynamicImports: true,
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({ extensions, browser: true }),
    commonjs(),
    typescript(),
    typescriptPaths({ preserveExtensions: true }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/env'],
      extensions,
    }),
    postcss({
      plugins: [autoprefixer(), tailwindcss()],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: true,
      inject: false,
    }),
    json({ compact: true }),
    min ? terser({ output: { comments: false } }) : null,
  ],
});

const configs = [
  reactImportEsBundle,
  {
    ...reactImportEsBundle,
    input: './src/web.ts',
    output: {
      file: 'dist/web.js',
      format: 'es',
      inlineDynamicImports: true,
    }
  },
  webFullBundle({ min: true }),
]

export default configs
