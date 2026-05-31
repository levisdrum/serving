import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (!id.includes('node_modules'))
                        return undefined;
                    var segments = id.split('node_modules/');
                    var afterNodeModules = segments[segments.length - 1];
                    if (!afterNodeModules)
                        return 'vendor';
                    var parts = afterNodeModules.split('/');
                    var packageName = parts[0].startsWith('@') ? "".concat(parts[0], "-").concat(parts[1]) : parts[0];
                    if (packageName === 'client-only')
                        return undefined;
                    return "vendor-".concat(packageName.replace('@', '').replace('/', '-'));
                }
            }
        }
    }
});
