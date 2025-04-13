#!/bin/bash
# Clean previous builds and create a new build directory
rm -rf build/
mkdir build

# Copy necessary folders to build directory
cp -R docs/ build/docs/
cp -R src/ build/src/
cp -R submodules/ build/submodules/
cp LICENSE README.md package.json tsconfig.json build/

# Install dependencies for submodules
echo "Installing dependencies for submodules..."
for submodule in build/submodules/*/; do
  if [ -f "${submodule}package.json" ]; then
    echo "Installing dependencies for ${submodule}..."
    (cd "${submodule}" && npm install)
  fi
done

# Run tests before packaging
echo "Running tests..."
bash scripts/test.sh
if [ $? -ne 0 ]; then
    echo "Tests failed. Aborting build."
    exit 1
fi

# Create the zip file
zip -r DeFi-Oracle-Tooling-Web3-Dashpanel.zip build/

echo "Build complete! DeFi-Oracle-Tooling-Web3-Dashpanel.zip has been created."
