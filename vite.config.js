import {
  fileURLToPath,
  URL
} from 'node:url'
import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {
  VitePWA
} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dts: false,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      manifest: {
        name: "PortalImendes",
        short_name: "PortalImendes",
        start_url: "/",
        display: "standalone",
        description: 'Portal IMendes - Inovação tributária para seu Negócio. A gestão tributária de sua Empresa muito mais produtiva, segura e tranquila. Atendemos os 27 estados.',
        theme_color: '#ffffff',
        icons: [{
            src: 'favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src',
        import.meta.url))
    }
  },

  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/assets/less/main.less";`
      }
    }
  },

})