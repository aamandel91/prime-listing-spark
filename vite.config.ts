import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - rarely change, cache well
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
          ],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Heavy admin-only dependencies - never load in production for users
          'admin-editor': ['react-quill'],
          'admin-maps': ['@react-google-maps/api'],
          
          // CMS modules are automatically code-split via React.lazy()
          // No manual chunking needed to avoid conflicts with dynamic imports
        },
      },
    },
    // Performance optimizations
    target: 'esnext',
    minify: mode === 'production' ? 'esbuild' : false,
    // Split chunks at 500KB for optimal caching
    chunkSizeWarningLimit: 500,
    // Generate source maps for debugging in production
    sourcemap: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
    ],
    exclude: [
      // Don't pre-bundle heavy admin dependencies
      'react-quill',
      '@react-google-maps/api',
    ],
  },
}));