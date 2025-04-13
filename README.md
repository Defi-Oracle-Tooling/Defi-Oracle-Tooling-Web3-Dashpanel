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

## Mock Data for Testing

If no connection is found, you can use mock data to test the application. This ensures that the application can be tested without relying on live connections or external services.

### Steps to Use Mock Data

1. **Backend Mock Data**:
   - Create mock data files in the `backend/app/models/mock_data/` directory.
   - Example:
     ```python
     # backend/app/models/mock_data/sample_data.py
     MOCK_VIRTUAL_ACCOUNTS = [
         {"id": "1", "balance": 100.0, "currency": "USD"},
         {"id": "2", "balance": 200.0, "currency": "EUR"},
     ]
     ```
   - Update the service functions to use mock data when no connection is available.

2. **Frontend Mock Data**:
   - Add mock data in the `src/frontend/utils/mockData.ts` file.
   - Example:
     ```typescript
     export const MOCK_USER_DATA = [
         { id: "1", name: "John Doe", balance: 100 },
         { id: "2", name: "Jane Smith", balance: 200 },
     ];
     ```
   - Use this data in components when testing without a backend connection.

3. **Middleware Mock Data**:
   - Add mock responses in the `src/middleware/mockResponses/` directory.
   - Example:
     ```typescript
     // src/middleware/mockResponses/sampleResponse.ts
     export const MOCK_RESPONSE = {
         status: "success",
         data: [
             { id: "1", value: "Mock Value 1" },
             { id: "2", value: "Mock Value 2" },
         ],
     };
     ```
   - Update middleware routes to return mock responses when no connection is available.

4. **Testing with Mock Data**:
   - Ensure that the application can switch between live data and mock data using environment variables or configuration settings.
   - Example:
     ```bash
     USE_MOCK_DATA=true pnpm run dev
     ```
