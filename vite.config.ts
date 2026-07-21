import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Serve "image asset" folder at /image asset/ URL
      {
        name: 'serve-image-asset',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url) {
              const decodedUrl = decodeURI(req.url);
              if (decodedUrl.startsWith('/image asset/')) {
                const fileName = decodeURIComponent(decodedUrl.replace('/image asset/', ''));
                const filePath = path.resolve(__dirname, 'image asset', fileName);
                if (fs.existsSync(filePath)) {
                  const ext = path.extname(fileName).toLowerCase();
                  const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
                  res.setHeader('Content-Type', mimeType);
                  res.setHeader('Cache-Control', 'public, max-age=86400');
                  fs.createReadStream(filePath).pipe(res);
                  return;
                }
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
