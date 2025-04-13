#!/bin/bash
echo "Running Vitest tests..."
pnpm exec vitest run
if [ $? -ne 0 ]; then
  echo "Vitest tests failed."
  exit 1
fi

# Additional Foundry tests commands can be added here if needed
echo "All tests passed."
