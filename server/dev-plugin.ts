import { loadEnv, type Plugin } from 'vite';
import { chatHandler } from './chat.ts';

export function localChat(): Plugin {
  return {
    name: 'local-soobin-api',
    configureServer(server) {
      // These values stay in the Node process; never put them in Vite's define/envPrefix.
      const env = loadEnv(server.config.mode, server.config.root, 'GEMINI_');
      for (const name of ['GEMINI_API_KEY', 'GEMINI_MODEL']) if (env[name]) process.env[name] = env[name];
      server.middlewares.use('/api/chat', (req, res) => {
        chatHandler(req, res).catch(() => {
          if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
          res.end(JSON.stringify({ error: 'Soobin is taking a break. Please try again.' }));
        });
      });
    }
  };
}
