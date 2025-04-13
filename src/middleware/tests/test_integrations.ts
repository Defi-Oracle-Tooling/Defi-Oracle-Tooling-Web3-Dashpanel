import { describe, it, expect } from "vitest";
import tatumIntegration from "../integrations/tatum";
import dodoexIntegration from "../integrations/dodoex";
import aaveSpecialLeverIntegration from "../integrations/aave_special_lever";

// Mock environment variables
process.env.TATUM_API_KEY = "dummy-tatum-api-key";
process.env.DODOEX_API_KEY = "dummy-dodoex-api-key";
process.env.AAVE_API_KEY = "dummy-aave-api-key";

describe("Integration Tests", () => {
    it("should fetch data from Tatum.io", async () => {
        const result = await tatumIntegration();
        expect(result).toHaveProperty("service", "Tatum.io");
        expect(result).toHaveProperty("status");
    });

    it("should fetch data from Dodoex.io", async () => {
        const result = await dodoexIntegration();
        expect(result).toHaveProperty("service", "Dodoex.io");
        expect(result).toHaveProperty("status");
    });

    it("should fetch data from Aave Special Lever", async () => {
        const result = await aaveSpecialLeverIntegration();
        expect(result).toHaveProperty("service", "Aave Special Lever");
        expect(result).toHaveProperty("status");
    });
});
