import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

const extensions = ['.ts', '.tsx']

const indexConfig = {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'es',
  },
  external: [/@babel/, 'react', 'react/jsx-runtime', '@openbot/js2', '@openbot/js2/dist/web'],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    typescript(),
    typescriptPaths({ preserveExtensions: true }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react', '@babel/preset-typescript', '@babel/env'],
      plugins: ['@babel/plugin-transform-runtime'],
      extensions,
    }),
    terser({ output: { comments: false } }),
  ],
}

const configs = [indexConfig]

export default configs
