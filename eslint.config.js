import globals from "globals";
import tseslint from "typescript-eslint";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default tseslint.config(
    // Global ignores - Apply these first
    {
        ignores: [
            "node_modules/",
            "dist/",
            "build/",
            "coverage/",
            "**/*.md",
            "**/*.json", // Keep package.json, tsconfig.json etc. lintable if needed later, but ignore for now
            "**/*.yaml",
            "**/*.yml",
            "submodules/",
            "**/pnpm-lock.yaml",
            "eslint.config.js" // Don't lint the config itself
        ],
    },
    // Base configuration for TS/TSX files
    {
        files: ["src/**/*.ts", "src/**/*.tsx"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: true, // Use tsconfig.json
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.browser, // For frontend code
                ...globals.node,    // For middleware/backend code
            },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            prettier: pluginPrettier,
        },
        rules: {
            // Start with recommended rules
            ...tseslint.configs.eslintRecommended.rules,
            ...tseslint.configs.recommendedTypeChecked.rules, // Use type-checked rules
            // Add Prettier integration
            ...configPrettier.rules, // Disables rules conflicting with Prettier
            "prettier/prettier": "warn", // Show Prettier issues as warnings
            // Customize rules
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" }, // Allow unused vars starting with _
            ],
            // "@typescript-eslint/explicit-module-boundary-types": "off", // Allow inferred return types for now
            "@typescript-eslint/explicit-module-boundary-types": "warn", // Require explicit return types
            "no-console": "warn", // Warn about console.log
            "@typescript-eslint/no-explicit-any": "error", // Changed from "warn" to "error"
            "@typescript-eslint/no-floating-promises": "error", // Changed from "warn" to "error"
            // Add specific rules based on project needs later
        },
    }
);
