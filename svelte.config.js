import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x'
		}),
		alias: {
			$components: 'src/lib/components',
			$lib: 'src/lib',
			$stores: 'src/lib/stores',
			$services: 'src/lib/services',
			$types: 'src/lib/types',
			$utils: 'src/lib/utils'
		}
	}
};

export default config;
