import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Optional: Configure server port, base path etc. if needed
    // server: {
    //   port: 3000
    // }
})