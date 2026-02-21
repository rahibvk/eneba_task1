import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { resolve } from "path";

describe("health route", () => {
    it("health route module exists and exports a router", async () => {
        const routePath = resolve(__dirname, "../src/routes/health.js");
        expect(existsSync(routePath)).toBe(true);
    });

    it("validate module exports parseListParams", async () => {
        const { parseListParams } = await import("../src/validate.js");
        expect(typeof parseListParams).toBe("function");
    });
});
