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
   - Admin: `src/frontend/admin/index.html`
   - User: `src/frontend/user/index.html`

## Testing

```bash
pnpm test
```

## Build

```bash
pnpm run build
```