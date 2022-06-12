import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from '@honkhonk/vite-plugin-svgr'

// https://vitejs.dev/config/
export default ({ mode }) => {
	process.env = {...process.env, ...loadEnv(mode, process.cwd())};

	return defineConfig({
		plugins: [svgr(), tsconfigPaths(), react()],
	});
}
