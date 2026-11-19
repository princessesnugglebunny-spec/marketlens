import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: 'src/content/index.ts',
        background: 'src/background/index.ts',
        popup: 'src/popup/index.ts',
        options: 'src/options/index.ts',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    target: 'es2022',
    minify: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
