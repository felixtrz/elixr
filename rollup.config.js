import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

export default [
	{
		input: 'src/index.js',
		plugins: [
			peerDepsExternal(),
			replace({
				'process.env.NODE_ENV': JSON.stringify('development'),
				delimiters: ['', ''],
			}),
			json({ exclude: ['node_modules/**'] }),
			nodeResolve(),
			commonjs(),
		],
		output: [
			{
				format: 'umd',
				name: 'ELIXR',
				noConflict: true,
				file: 'build/elixr.js',
				indent: '\t',
				sourcemap: true,
			},
			{
				format: 'es',
				file: 'build/elixr.module.js',
				indent: '\t',
				sourcemap: true,
			},
		],
	},
	{
		input: 'src/index.js',
		plugins: [
			peerDepsExternal(),
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
				delimiters: ['', ''],
			}),
			json({ exclude: ['node_modules/**'] }),
			nodeResolve(),
			terser(),
			commonjs(),
		],
		output: [
			{
				format: 'umd',
				name: 'ELIXR',
				noConflict: true,
				file: 'build/elixr.min.js',
				indent: '\t',
				sourcemap: true,
			},
			{
				format: 'es',
				file: 'build/elixr.module.min.js',
				indent: '\t',
				sourcemap: true,
			},
		],
	},
];
