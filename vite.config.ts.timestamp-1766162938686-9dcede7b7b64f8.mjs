// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";
import * as javascriptObfuscator from "file:///home/project/node_modules/javascript-obfuscator/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // PWA Plugin for better performance and SEO
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // 365 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
                // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/i\.ibb\.co\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "logo-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // 365 days
              }
            }
          }
        ]
      },
      manifest: {
        name: "TechyTak - Agence Web Tunisie",
        short_name: "TechyTak",
        description: "Agence web tunisienne sp\xE9cialis\xE9e d\xE9veloppement web et mobile",
        theme_color: "#8B5FFF",
        background_color: "#000000",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait-primary",
        categories: ["business", "productivity"],
        lang: "fr-TN",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    }),
    // Your existing obfuscation plugin
    {
      name: "obfuscate-code",
      generateBundle(options, bundle) {
        if (bundle.type === "chunk" && bundle.fileName.endsWith(".js")) {
          if (bundle.fileName.includes("vendor") || bundle.fileName.includes("ui") || bundle.fileName.includes("utils") || bundle.fileName.includes("webvitals")) {
            return bundle;
          }
          const obfuscatedCode = javascriptObfuscator.obfuscate(bundle.code, {
            // Less aggressive settings to prevent breaking the application
            compact: true,
            controlFlowFlattening: false,
            // Disabled to prevent breaking code
            controlFlowFlatteningThreshold: 0.75,
            numbersToExpressions: false,
            // Disabled to prevent breaking code
            simplify: true,
            shuffleStringArray: true,
            splitStrings: false,
            // Disabled to prevent breaking code
            stringArrayThreshold: 0.5,
            // Reduced threshold
            stringArrayWrappersCount: 1,
            // Reduced count
            stringArrayWrappersChainedCalls: false,
            // Disabled to prevent breaking code
            stringArrayWrappersParametersMaxCount: 2,
            // Reduced max count
            stringArrayWrappersType: "function",
            stringArrayIndexShift: true,
            deadCodeInjection: false,
            // Disabled to prevent breaking code
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            // Disabled for debugging
            debugProtectionInterval: false,
            // Disabled
            disableConsoleOutput: true,
            // Use mangled instead of hexadecimal to preserve readability
            identifierNamesGenerator: "mangled",
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: true,
            seed: "your-secret-seed-here",
            shuffleStringArray: true,
            splitStrings: false,
            // Disabled to prevent breaking code
            splitStringsChunkLength: 10,
            unicodeEscapeSequence: false,
            // Disabled to prevent breaking code
            // Reserve common global variables that might be accessed + web vitals
            reservedNames: ["xs", "Qn", "io", "React", "ReactDOM", "window", "document", "global", "process", "getCLS", "getFID", "getFCP", "getLCP", "getTTFB"]
          });
          return {
            ...bundle,
            code: obfuscatedCode,
            map: null
            // Remove source maps
          };
        }
        return bundle;
      }
    }
  ],
  build: {
    outDir: "dist",
    sourcemap: false,
    // Disable source maps
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        // Remove console.log statements
        pure_funcs: ["console.log", "console.info", "console.warn"],
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
        warnings: false
      },
      mangle: {
        safari10: true,
        properties: false,
        // Disabled to prevent breaking code
        reserved: ["xs", "Qn", "io", "React", "ReactDOM", "window", "document", "global", "process", "getCLS", "getFID", "getFCP", "getLCP", "getTTFB"],
        toplevel: true
      },
      format: {
        comments: false
        // Remove all comments
      }
    },
    rollupOptions: {
      output: {
        // Enhanced manual chunks for better performance
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["framer-motion", "lucide-react"],
          utils: ["@vercel/analytics", "@supabase/supabase-js"],
          webvitals: ["web-vitals"]
          // Separate chunk for performance monitoring
        },
        banner: `
          // This code is proprietary and confidential.
          // Unauthorized use, reproduction, or distribution is strictly prohibited.
          // Copyright \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} TechyTak. All rights reserved.
        `
      }
    },
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 800
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: ["web-vitals"]
    // Pre-bundle web-vitals for better performance
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    __APP_VERSION__: JSON.stringify("1.0.0"),
    __BUILD_TIME__: JSON.stringify((/* @__PURE__ */ new Date()).toISOString())
  },
  css: {
    postcss: "./postcss.config.js",
    // Add CSS optimization
    devSourcemap: false
  },
  server: {
    sourcemap: false,
    hmr: {
      overlay: false
    }
  },
  preview: {
    headers: {
      "/": [
        {
          key: "X-Content-Type-Options",
          value: "nosniff"
        },
        {
          key: "X-Frame-Options",
          value: "DENY"
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block"
        },
        // Add SEO and performance-friendly headers
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable"
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains"
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin"
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCAqIGFzIGphdmFzY3JpcHRPYmZ1c2NhdG9yIGZyb20gJ2phdmFzY3JpcHQtb2JmdXNjYXRvcic7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbIFxuICAgIHJlYWN0KCksXG4gICAgLy8gUFdBIFBsdWdpbiBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlIGFuZCBTRU9cbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57anMsY3NzLGh0bWwsaWNvLHBuZyxzdmcsanBnLGpwZWcsd2VicH0nXSxcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ZvbnRzXFwuZ29vZ2xlYXBpc1xcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2dvb2dsZS1mb250cy1jYWNoZScsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUgLy8gMzY1IGRheXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdzdGF0aWNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdnc3RhdGljLWZvbnRzLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ltYWdlc1xcLnVuc3BsYXNoXFwuY29tXFwvLiovaSxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnaW1hZ2VzLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDUwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDMwIC8vIDMwIGRheXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9pXFwuaWJiXFwuY29cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdsb2dvLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSAvLyAzNjUgZGF5c1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ1RlY2h5VGFrIC0gQWdlbmNlIFdlYiBUdW5pc2llJyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ1RlY2h5VGFrJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBZ2VuY2Ugd2ViIHR1bmlzaWVubmUgc3BcdTAwRTljaWFsaXNcdTAwRTllIGRcdTAwRTl2ZWxvcHBlbWVudCB3ZWIgZXQgbW9iaWxlJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjOEI1RkZGJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIHNjb3BlOiAnLycsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgICBvcmllbnRhdGlvbjogJ3BvcnRyYWl0LXByaW1hcnknLFxuICAgICAgICBjYXRlZ29yaWVzOiBbJ2J1c2luZXNzJywgJ3Byb2R1Y3Rpdml0eSddLFxuICAgICAgICBsYW5nOiAnZnItVE4nLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ3B3YS02NHg2NC5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc2NHg2NCcsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAncHdhLTE5MngxOTIucG5nJywgXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ3B3YS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLCBcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSBtYXNrYWJsZSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KSxcbiAgICAvLyBZb3VyIGV4aXN0aW5nIG9iZnVzY2F0aW9uIHBsdWdpblxuICAgIHtcbiAgICAgIG5hbWU6ICdvYmZ1c2NhdGUtY29kZScsXG4gICAgICBnZW5lcmF0ZUJ1bmRsZShvcHRpb25zLCBidW5kbGUpIHtcbiAgICAgICAgaWYgKGJ1bmRsZS50eXBlID09PSAnY2h1bmsnICYmIGJ1bmRsZS5maWxlTmFtZS5lbmRzV2l0aCgnLmpzJykpIHtcbiAgICAgICAgICAvLyBTa2lwIG9iZnVzY2F0aW9uIGZvciB2ZW5kb3IgY2h1bmtzIHRvIGF2b2lkIGJyZWFraW5nIHRoaXJkLXBhcnR5IGxpYnJhcmllc1xuICAgICAgICAgIGlmIChidW5kbGUuZmlsZU5hbWUuaW5jbHVkZXMoJ3ZlbmRvcicpIHx8IGJ1bmRsZS5maWxlTmFtZS5pbmNsdWRlcygndWknKSB8fCBidW5kbGUuZmlsZU5hbWUuaW5jbHVkZXMoJ3V0aWxzJykgfHwgYnVuZGxlLmZpbGVOYW1lLmluY2x1ZGVzKCd3ZWJ2aXRhbHMnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJ1bmRsZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBvYmZ1c2NhdGVkQ29kZSA9IGphdmFzY3JpcHRPYmZ1c2NhdG9yLm9iZnVzY2F0ZShidW5kbGUuY29kZSwge1xuICAgICAgICAgICAgLy8gTGVzcyBhZ2dyZXNzaXZlIHNldHRpbmdzIHRvIHByZXZlbnQgYnJlYWtpbmcgdGhlIGFwcGxpY2F0aW9uXG4gICAgICAgICAgICBjb21wYWN0OiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbEZsb3dGbGF0dGVuaW5nOiBmYWxzZSwgLy8gRGlzYWJsZWQgdG8gcHJldmVudCBicmVha2luZyBjb2RlXG4gICAgICAgICAgICBjb250cm9sRmxvd0ZsYXR0ZW5pbmdUaHJlc2hvbGQ6IDAuNzUsXG4gICAgICAgICAgICBudW1iZXJzVG9FeHByZXNzaW9uczogZmFsc2UsIC8vIERpc2FibGVkIHRvIHByZXZlbnQgYnJlYWtpbmcgY29kZVxuICAgICAgICAgICAgc2ltcGxpZnk6IHRydWUsXG4gICAgICAgICAgICBzaHVmZmxlU3RyaW5nQXJyYXk6IHRydWUsXG4gICAgICAgICAgICBzcGxpdFN0cmluZ3M6IGZhbHNlLCAvLyBEaXNhYmxlZCB0byBwcmV2ZW50IGJyZWFraW5nIGNvZGVcbiAgICAgICAgICAgIHN0cmluZ0FycmF5VGhyZXNob2xkOiAwLjUsIC8vIFJlZHVjZWQgdGhyZXNob2xkXG4gICAgICAgICAgICBzdHJpbmdBcnJheVdyYXBwZXJzQ291bnQ6IDEsIC8vIFJlZHVjZWQgY291bnRcbiAgICAgICAgICAgIHN0cmluZ0FycmF5V3JhcHBlcnNDaGFpbmVkQ2FsbHM6IGZhbHNlLCAvLyBEaXNhYmxlZCB0byBwcmV2ZW50IGJyZWFraW5nIGNvZGVcbiAgICAgICAgICAgIHN0cmluZ0FycmF5V3JhcHBlcnNQYXJhbWV0ZXJzTWF4Q291bnQ6IDIsIC8vIFJlZHVjZWQgbWF4IGNvdW50XG4gICAgICAgICAgICBzdHJpbmdBcnJheVdyYXBwZXJzVHlwZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgIHN0cmluZ0FycmF5SW5kZXhTaGlmdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlYWRDb2RlSW5qZWN0aW9uOiBmYWxzZSwgLy8gRGlzYWJsZWQgdG8gcHJldmVudCBicmVha2luZyBjb2RlXG4gICAgICAgICAgICBkZWFkQ29kZUluamVjdGlvblRocmVzaG9sZDogMC40LFxuICAgICAgICAgICAgZGVidWdQcm90ZWN0aW9uOiBmYWxzZSwgLy8gRGlzYWJsZWQgZm9yIGRlYnVnZ2luZ1xuICAgICAgICAgICAgZGVidWdQcm90ZWN0aW9uSW50ZXJ2YWw6IGZhbHNlLCAvLyBEaXNhYmxlZFxuICAgICAgICAgICAgZGlzYWJsZUNvbnNvbGVPdXRwdXQ6IHRydWUsXG4gICAgICAgICAgICAvLyBVc2UgbWFuZ2xlZCBpbnN0ZWFkIG9mIGhleGFkZWNpbWFsIHRvIHByZXNlcnZlIHJlYWRhYmlsaXR5XG4gICAgICAgICAgICBpZGVudGlmaWVyTmFtZXNHZW5lcmF0b3I6ICdtYW5nbGVkJyxcbiAgICAgICAgICAgIHJlbmFtZUdsb2JhbHM6IGZhbHNlLFxuICAgICAgICAgICAgcm90YXRlU3RyaW5nQXJyYXk6IHRydWUsXG4gICAgICAgICAgICBzZWxmRGVmZW5kaW5nOiB0cnVlLFxuICAgICAgICAgICAgc2VlZDogJ3lvdXItc2VjcmV0LXNlZWQtaGVyZScsXG4gICAgICAgICAgICBzaHVmZmxlU3RyaW5nQXJyYXk6IHRydWUsXG4gICAgICAgICAgICBzcGxpdFN0cmluZ3M6IGZhbHNlLCAvLyBEaXNhYmxlZCB0byBwcmV2ZW50IGJyZWFraW5nIGNvZGVcbiAgICAgICAgICAgIHNwbGl0U3RyaW5nc0NodW5rTGVuZ3RoOiAxMCxcbiAgICAgICAgICAgIHVuaWNvZGVFc2NhcGVTZXF1ZW5jZTogZmFsc2UsIC8vIERpc2FibGVkIHRvIHByZXZlbnQgYnJlYWtpbmcgY29kZVxuICAgICAgICAgICAgLy8gUmVzZXJ2ZSBjb21tb24gZ2xvYmFsIHZhcmlhYmxlcyB0aGF0IG1pZ2h0IGJlIGFjY2Vzc2VkICsgd2ViIHZpdGFsc1xuICAgICAgICAgICAgcmVzZXJ2ZWROYW1lczogWyd4cycsICdRbicsICdpbycsICdSZWFjdCcsICdSZWFjdERPTScsICd3aW5kb3cnLCAnZG9jdW1lbnQnLCAnZ2xvYmFsJywgJ3Byb2Nlc3MnLCAnZ2V0Q0xTJywgJ2dldEZJRCcsICdnZXRGQ1AnLCAnZ2V0TENQJywgJ2dldFRURkInXVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5idW5kbGUsXG4gICAgICAgICAgICBjb2RlOiBvYmZ1c2NhdGVkQ29kZSxcbiAgICAgICAgICAgIG1hcDogbnVsbCwgLy8gUmVtb3ZlIHNvdXJjZSBtYXBzXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnVuZGxlO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsIC8vIERpc2FibGUgc291cmNlIG1hcHNcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSwgLy8gUmVtb3ZlIGNvbnNvbGUubG9nIHN0YXRlbWVudHNcbiAgICAgICAgcHVyZV9mdW5jczogWydjb25zb2xlLmxvZycsICdjb25zb2xlLmluZm8nLCAnY29uc29sZS53YXJuJ10sXG4gICAgICAgIHNlcXVlbmNlczogdHJ1ZSxcbiAgICAgICAgZGVhZF9jb2RlOiB0cnVlLFxuICAgICAgICBjb25kaXRpb25hbHM6IHRydWUsXG4gICAgICAgIGJvb2xlYW5zOiB0cnVlLFxuICAgICAgICB1bnVzZWQ6IHRydWUsXG4gICAgICAgIGlmX3JldHVybjogdHJ1ZSxcbiAgICAgICAgam9pbl92YXJzOiB0cnVlLFxuICAgICAgICBjb2xsYXBzZV92YXJzOiB0cnVlLFxuICAgICAgICByZWR1Y2VfdmFyczogdHJ1ZSxcbiAgICAgICAgaG9pc3RfZnVuczogdHJ1ZSxcbiAgICAgICAgd2FybmluZ3M6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIG1hbmdsZToge1xuICAgICAgICBzYWZhcmkxMDogdHJ1ZSxcbiAgICAgICAgcHJvcGVydGllczogZmFsc2UsIC8vIERpc2FibGVkIHRvIHByZXZlbnQgYnJlYWtpbmcgY29kZVxuICAgICAgICByZXNlcnZlZDogWyd4cycsICdRbicsICdpbycsICdSZWFjdCcsICdSZWFjdERPTScsICd3aW5kb3cnLCAnZG9jdW1lbnQnLCAnZ2xvYmFsJywgJ3Byb2Nlc3MnLCAnZ2V0Q0xTJywgJ2dldEZJRCcsICdnZXRGQ1AnLCAnZ2V0TENQJywgJ2dldFRURkInXSxcbiAgICAgICAgdG9wbGV2ZWw6IHRydWUsXG4gICAgICB9LFxuICAgICAgZm9ybWF0OiB7XG4gICAgICAgIGNvbW1lbnRzOiBmYWxzZSwgLy8gUmVtb3ZlIGFsbCBjb21tZW50c1xuICAgICAgfSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBFbmhhbmNlZCBtYW51YWwgY2h1bmtzIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2VcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgIHVpOiBbJ2ZyYW1lci1tb3Rpb24nLCAnbHVjaWRlLXJlYWN0J10sXG4gICAgICAgICAgdXRpbHM6IFsnQHZlcmNlbC9hbmFseXRpY3MnLCAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ10sXG4gICAgICAgICAgd2Vidml0YWxzOiBbJ3dlYi12aXRhbHMnXSAvLyBTZXBhcmF0ZSBjaHVuayBmb3IgcGVyZm9ybWFuY2UgbW9uaXRvcmluZ1xuICAgICAgICB9LFxuICAgICAgICBiYW5uZXI6IGBcbiAgICAgICAgICAvLyBUaGlzIGNvZGUgaXMgcHJvcHJpZXRhcnkgYW5kIGNvbmZpZGVudGlhbC5cbiAgICAgICAgICAvLyBVbmF1dGhvcml6ZWQgdXNlLCByZXByb2R1Y3Rpb24sIG9yIGRpc3RyaWJ1dGlvbiBpcyBzdHJpY3RseSBwcm9oaWJpdGVkLlxuICAgICAgICAgIC8vIENvcHlyaWdodCBcdTAwQTkgJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9IFRlY2h5VGFrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICAgICAgICBgLFxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gT3B0aW1pemUgY2h1bmsgc2l6ZSB3YXJuaW5nIGxpbWl0XG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA4MDAsXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgaW5jbHVkZTogWyd3ZWItdml0YWxzJ10sIC8vIFByZS1idW5kbGUgd2ViLXZpdGFscyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXG4gIH0sXG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdwcm9kdWN0aW9uJyksXG4gICAgX19BUFBfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeSgnMS4wLjAnKSxcbiAgICBfX0JVSUxEX1RJTUVfXzogSlNPTi5zdHJpbmdpZnkobmV3IERhdGUoKS50b0lTT1N0cmluZygpKSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczogJy4vcG9zdGNzcy5jb25maWcuanMnLFxuICAgIC8vIEFkZCBDU1Mgb3B0aW1pemF0aW9uXG4gICAgZGV2U291cmNlbWFwOiBmYWxzZSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHByZXZpZXc6IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnLyc6IFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogJ1gtQ29udGVudC1UeXBlLU9wdGlvbnMnLFxuICAgICAgICAgIHZhbHVlOiAnbm9zbmlmZicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdYLUZyYW1lLU9wdGlvbnMnLFxuICAgICAgICAgIHZhbHVlOiAnREVOWScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdYLVhTUy1Qcm90ZWN0aW9uJyxcbiAgICAgICAgICB2YWx1ZTogJzE7IG1vZGU9YmxvY2snLFxuICAgICAgICB9LFxuICAgICAgICAvLyBBZGQgU0VPIGFuZCBwZXJmb3JtYW5jZS1mcmllbmRseSBoZWFkZXJzXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdDYWNoZS1Db250cm9sJyxcbiAgICAgICAgICB2YWx1ZTogJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCwgaW1tdXRhYmxlJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGtleTogJ1N0cmljdC1UcmFuc3BvcnQtU2VjdXJpdHknLFxuICAgICAgICAgIHZhbHVlOiAnbWF4LWFnZT0zMTUzNjAwMDsgaW5jbHVkZVN1YkRvbWFpbnMnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiAnUmVmZXJyZXItUG9saWN5JyxcbiAgICAgICAgICB2YWx1ZTogJ3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiAnUGVybWlzc2lvbnMtUG9saWN5JyxcbiAgICAgICAgICB2YWx1ZTogJ2NhbWVyYT0oKSwgbWljcm9waG9uZT0oKSwgZ2VvbG9jYXRpb249KCknLFxuICAgICAgICB9XG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIs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
