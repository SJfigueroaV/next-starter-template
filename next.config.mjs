import pathModule from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  webpack: (config, { isServer, webpack }) => {
    // Configurar webpack para manejar mejor react-pdf y pdfjs-dist
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    // Ignorar canvas solo en el cliente (navegador)
    if (!isServer) {
      // Usar alias para reemplazar canvas con un stub vacío
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: pathModule.resolve(__dirname, 'src/lib/canvas-stub.js'),
      };
      
      // Usar NormalModuleReplacementPlugin para reemplazar canvas
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^canvas$/,
          pathModule.resolve(__dirname, 'src/lib/canvas-stub.js')
        )
      );
      
      // También usar IgnorePlugin como respaldo
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^canvas$/,
        })
      );
    }
    
    return config;
  },
};

export default nextConfig;
