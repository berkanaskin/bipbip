import { defineConfig } from 'vite';

export default defineConfig({
    base: '/BipBip/',
    server: {
        host: true,
        port: 5173
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ['three']
                }
            }
        }
    },
    assetsInclude: ['**/*.glb', '**/*.gltf']
});
