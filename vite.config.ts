import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'
import { fresh } from '@fresh/plugin-vite'

export default defineConfig({
	server: {
		/**
		 * A literal IP address or host name that can be resolved to an IP address.
		 * __Note about `0.0.0.0`__ While listening `0.0.0.0` works on all platforms,
		 * the browsers on Windows don't work with the address `0.0.0.0`.
		 * You should show the message like `server running on localhost:8080` instead of
		 * `server running on 0.0.0.0:8080` if your program supports Windows.
		 * @default {"0.0.0.0"}
		 */
		host: Deno.env.get('APP_HOSTNAME') || '0.0.0.0',
		/** The port to listen on.
		 * @default {5173} */
		port: Number(Deno.env.get('APP_PORT')) || 5173,
	},
	build: {
		/**
		 * The directory to write generated files to when `dev.ts build` is run.
		 * This can be an absolute path, a file URL or a relative path.
		 * @default {'./_fresh'}
		 */
		outDir: './_dist',
		/**
		 * This sets the target environment for the generated code. Newer
		 * language constructs will be transformed to match the specified
		 * support range. See https://esbuild.github.io/api/#target
		 * @default {"es2022"}
		 */
		target: ['es2024'],
	},
	plugins: [
		fresh({
			// Path to main server entry file. Default: main.ts
			serverEntry: './main.ts',
			// Path to main client entry file. Default: client.ts
			clientEntry: './client.ts',
			// Path to islands directory. Default: ./islands
			islandsDir: './islands',
			// Path to routes directory. Default: ./routes
			routeDir: './routes',
			// Optional regex to ignore folders when crawling the routes and
			// island directory.
			ignore: [/[\\/]+some-folder[\\/]+/],
			// Additional specifiers to treat as island files. This is used
			// for declaring islands from third party packages.
			islandSpecifiers: [],
		}),
		tailwindcss(),
	],
})
