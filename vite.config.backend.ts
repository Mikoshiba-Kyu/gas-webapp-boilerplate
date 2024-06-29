import { defineConfig } from 'vite'
import rollupPluginGas from 'rollup-plugin-google-apps-script'

export default defineConfig({
  plugins: [rollupPluginGas()],
  build: {
    rollupOptions: {
      input: 'src/backend/main.ts',
      output: {
        dir: 'gas/dist',
        entryFileNames: 'main.js',
      },
    },
    emptyOutDir: false,
    minify: false,
  },
})
