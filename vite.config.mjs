import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import Sitemap from "vite-plugin-sitemap";
import axios from "axios";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig(async ({ mode }) => {
  return {
    base: loadEnv(mode, process.cwd())["VITE_DIR"],
    plugins: [
      vue(),
      AutoImport({
        imports: [
          "vue",
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
      // PWA
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallbackDenylist: [/^\/history\/.*/, /^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/.*\.txt$/], // Exclude history and SEO files from SW navigation
          runtimeCaching: [
            {
              urlPattern: /(.*?)\.(woff2|woff|ttf)/,
              handler: "CacheFirst",
              options: {
                cacheName: "file-cache",
              },
            },
            {
              urlPattern:
                /(.*?)\.(webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache",
              },
            },
          ],
        },
        manifest: {
          name: "今日热榜",
          short_name: "DailyHot",
          description: "汇聚全网热点，热门尽览无余",
          display: "standalone",
          start_url: "/",
          theme_color: "#fff",
          background_color: "#efefef",
          icons: [
            {
              src: "/ico/favicon.png",
              sizes: "200x200",
              type: "image/png",
            },
          ],
        },
      }),
      Sitemap({
        hostname: loadEnv(mode, process.cwd())["VITE_GLOBAL_API"]?.replace("api.", "").replace("/api/", "") || "https://hot.efefee.cn",
        dynamicRoutes: await (async () => {
          try {
            const apiUrl = loadEnv(mode, process.cwd())["VITE_GLOBAL_API"] || "https://api-hot.efefee.cn";
            // remove trailing slash if exists for cleaner concatenation, though axios handles it
            const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

            // Need to import axios. Since we are in vite config (Node env), we can use require or dynamic import if axios is ESM/CJS hybrid, 
            // but since we are in .mjs and axios supports ESM, we can import it at top level.
            // However, to be safe inside the plugin config, we can use fetch if node 18+ or just use the imported axios if we add it to top imports.
            // Let's assume we will add import axios from 'axios' at top.

            const res = await axios.get(`${baseUrl}/history`);
            if (res.data && res.data.data) {
              // Force .html extension
              const routes = res.data.data.map(date => {
                const d = date.endsWith('.html') ? date : `${date}.html`;
                return `/history/${d}`;
              });
              console.log("DEBUG: Generated Sitemap Routes:", routes.slice(0, 5));
              return routes;
            }
            return [];
          } catch (error) {
            console.error("Failed to fetch history routes for sitemap:", error);
            return [];
          }
        })()
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 6699,
      proxy: {
        // 代理历史记录的 HTML 请求到后端
        "^/history/.*\\.html$": {
          target: loadEnv(mode, process.cwd())["VITE_GLOBAL_API"] || "http://localhost:6688",
          changeOrigin: true,
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
        },
      },
    },
  };
});
