# DeFi Oracle Tooling Web3 Dashpanel

This repository contains the full source code for a multi-purpose DeFi dashboard
solution. It includes modular backend submodules for integration with Aave,
Tatum, Dodoex.io, and SolaceNet, as well as middleware services, admin and user
frontend panels, and comprehensive test suites using Vitest and Foundry.

Please refer to the submodules README files for integration-specific details.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the middleware server:

   ```bash
   pnpm run dev
   ```

3. Access the frontend panels:
   - **Note:** The frontend panels (`admin.tsx`, `user.tsx`) are written in React/TSX. They need to be built into static JavaScript and CSS files before they can be served. The current `index.html` files might be placeholders or require a build step.
   - **Build Process (Example using Vite/esbuild - Adapt as needed):**
     - You might need to set up a build tool like Vite or esbuild for the `src/frontend` directory.
     - Configure the build tool to output static assets (e.g., into a `dist/frontend` directory).
     - Update the Express server in `src/middleware/server.ts` to serve these static assets.
     - Example (add to `server.ts`):
       ```typescript
       // Serve static frontend files (adjust path as needed)
       // app.use(express.static(path.join(__dirname, '../../dist/frontend'))); 
       ```
   - **Development:** For development, you might run a separate frontend development server (e.g., `vite dev`) alongside the middleware server (`pnpm run dev`).
   - ~~Admin: `src/frontend/admin/index.html`~~
   - ~~User: `src/frontend/user/index.html`~~

## Testing

```bash
pnpm test
```

## Build

```bash
pnpm run build
```
