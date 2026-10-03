import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000, // Set appropriate limit for your needs
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split react and react-dom into separate chunk
            if (id.includes('react') && (id.includes('/react-dom/') || id.includes('/react/jsx-runtime'))) {
              return 'react-vendor';
            }
            
            // Split PDF library into its own chunk
            if (id.includes('@react-pdf/renderer')) {
              return 'pdf-library';
            }

            // Split UI libraries
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'ui-vendor';
            }

            // Split remaining node_modules into vendor chunk
            return 'vendor';
          }

          // Split your source code into smaller chunks
          if (id.includes('src/components')) {
            const match = id.match(/src\/components\/(.*?)\//);
            return match ? `component-${match[1]}` : null;
          }
        }
      }
    }
  }
});