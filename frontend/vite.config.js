import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { VitePWA } from "vite-plugin-pwa";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	return defineConfig({
		plugins: [
			vue(),
			vuetify(),
			AutoImport({
				imports: [
					'vue',
					'vue-router',
					'pinia',
					'@vueuse/core',
					'@vueuse/math'
				],
				dirs: [
					'./src/@core/utils',
					'./src/@core/composable/',
					'./src/composables',
					'./src/utils',
					'./src/plugins',
					'./src/stores',
				],
				vueTemplate: true,

				// 🛑 Ignore specific composables to avoid conflict or misuse
				ignore: ['useCookies', 'useStorage'],
				deep: true,
				dts: './auto-imports.d.ts', // (optional) generate auto-import types
			}),
			Components({
				dirs: [
					'src/components/common',
					'src/layout',
				],
				extensions: ['vue'],
				deep: true,
				dts: './components.d.ts'
			}),
			VitePWA({
				registerType: 'autoUpdate',
				strategies: 'injectManifest',
				srcDir: 'src/service-worker',
				filename: 'sw.js',
				injectManifest: {
					globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
				},
				includeAssets: ['app.ico', 'robots.txt'],
				manifest: {
					name: 'Mobility App',
					short_name: 'MobiApp',
					description: 'Mobility App',
					theme_color: '#1867c0',
					background_color: '#ffffff',
					display: 'standalone',
					start_url: '/',
					icons: [
						{
							src: 'app192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: 'app512.png',
							sizes: '512x512',
							type: 'image/png'
						}
					]
				},
				devOptions: {
					enabled: true,           // ✅ ทำให้ PWA ใช้ได้ตอน dev
					type: 'module',          // ✅ ใช้ ESM แบบเดียวกับ production
					navigateFallback: '/'    // ✅ fallback ถ้าหา route ไม่เจอ
				}
			}),
		],
		resolve: {
			alias: {
				"@": resolve(__dirname, "src") // ✅ เปลี่ยนตรงนี้ด้วย!
			}
		},
		server: {
			// proxy: {
			// 	'/foo': 'http://localhost:4567',
			// 	'/api': {
			// 		target: env.VITE_BASE_API_URL,
			// 		changeOrigin: true,
			// 		rewrite: path => path.replace(/^\/api/, '')
			// 	}
			// }
			host: '0.0.0.0',
			port: 5173,
			proxy: {
				'/api': env.VITE_BASE_API_URL,
				'/socket.io': {
					target: env.VITE_BASE_API_URL,
					ws: true,
					changeOrigin: true
				},
				'/uploads': {
					target: env.VITE_BASE_API_URL,
					changeOrigin: true
				}
			}
		}
	});
}
