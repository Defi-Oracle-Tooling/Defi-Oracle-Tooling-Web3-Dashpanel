import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Define the root directory for the frontend project
    root: __dirname,
    // Adjust build output directory if needed, relative to root
    build: {
        outDir: './dist'
    },
    // Add server proxy configuration
    server: {
        proxy: {
            // Proxy requests starting with /api to the backend server
            '/api': {
                target: 'http://localhost:8000', // Your backend server address
                changeOrigin: true, // Recommended for virtual hosted sites
                // Optional: rewrite path if needed, e.g., remove /api prefix
                // rewrite: (path) => path.replace(/^\/api/, '') 
            }
        }
    }
})
