import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import * as javascriptObfuscator from 'javascript-obfuscator';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ 
    react(),
    // PWA Plugin for better performance and SEO
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/i\.ibb\.co\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'logo-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              }
            }
          }
        ]
      },
      manifest: {
        name: 'TechyTak - Agence Web Tunisie',
        short_name: 'TechyTak',
        description: 'Agence web tunisienne spécialisée développement web et mobile',
        theme_color: '#8B5FFF',
        background_color: '#000000',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        categories: ['business', 'productivity'],
        lang: 'fr-TN',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512', 
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    // Your existing obfuscation plugin
    {
      name: 'obfuscate-code',
      generateBundle(options, bundle) {
        if (bundle.type === 'chunk' && bundle.fileName.endsWith('.js')) {
          // Skip obfuscation for vendor chunks to avoid breaking third-party libraries
          if (bundle.fileName.includes('vendor') || bundle.fileName.includes('ui') || bundle.fileName.includes('utils') || bundle.fileName.includes('webvitals')) {
            return bundle;
          }

          const obfuscatedCode = javascriptObfuscator.obfuscate(bundle.code, {
            // Less aggressive settings to prevent breaking the application
            compact: true,
            controlFlowFlattening: false, // Disabled to prevent breaking code
            controlFlowFlatteningThreshold: 0.75,
            numbersToExpressions: false, // Disabled to prevent breaking code
            simplify: true,
            shuffleStringArray: true,
            splitStrings: false, // Disabled to prevent breaking code
            stringArrayThreshold: 0.5, // Reduced threshold
            stringArrayWrappersCount: 1, // Reduced count
            stringArrayWrappersChainedCalls: false, // Disabled to prevent breaking code
            stringArrayWrappersParametersMaxCount: 2, // Reduced max count
            stringArrayWrappersType: 'function',
            stringArrayIndexShift: true,
            deadCodeInjection: false, // Disabled to prevent breaking code
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false, // Disabled for debugging
            debugProtectionInterval: false, // Disabled
            disableConsoleOutput: true,
            // Use mangled instead of hexadecimal to preserve readability
            identifierNamesGenerator: 'mangled',
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: true,
            seed: 'your-secret-seed-here',
            shuffleStringArray: true,
            splitStrings: false, // Disabled to prevent breaking code
            splitStringsChunkLength: 10,
            unicodeEscapeSequence: false, // Disabled to prevent breaking code
            // Reserve common global variables that might be accessed + web vitals
            reservedNames: ['xs', 'Qn', 'io', 'React', 'ReactDOM', 'window', 'document', 'global', 'process', 'getCLS', 'getFID', 'getFCP', 'getLCP', 'getTTFB']
          });
          
          return {
            ...bundle,
            code: obfuscatedCode,
            map: null, // Remove source maps
          };
        }
        return bundle;
      },
    },
  ],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        collapse_vars: true,
        reduce_vars: true,
        hoist_funs: true,
        warnings: false,
      },
      mangle: {
        safari10: true,
        properties: false, // Disabled to prevent breaking code
        reserved: ['xs', 'Qn', 'io', 'React', 'ReactDOM', 'window', 'document', 'global', 'process', 'getCLS', 'getFID', 'getFCP', 'getLCP', 'getTTFB'],
        toplevel: true,
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    rollupOptions: {
      output: {
        // Enhanced manual chunks for better performance
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          utils: ['@vercel/analytics', '@supabase/supabase-js'],
          webvitals: ['web-vitals'] // Separate chunk for performance monitoring
        },
        banner: `
          // This code is proprietary and confidential.
          // Unauthorized use, reproduction, or distribution is strictly prohibited.
          // Copyright © ${new Date().getFullYear()} TechyTak. All rights reserved.
        `,
      }
    },
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 800,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['web-vitals'], // Pre-bundle web-vitals for better performance
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    __APP_VERSION__: JSON.stringify('1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  css: {
    postcss: './postcss.config.js',
    // Add CSS optimization
    devSourcemap: false,
  },
  server: {
    sourcemap: false,
    hmr: {
      overlay: false,
    },
  },
  preview: {
    headers: {
      '/': [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        // Add SEO and performance-friendly headers
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        }
      ],
    },
  },
});