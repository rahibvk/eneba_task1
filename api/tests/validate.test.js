import { describe, it, expect } from "vitest";

describe("parseListParams", () => {
    let parseListParams;

    // Dynamic import to handle CJS module
    beforeAll(async () => {
        const mod = await import("../src/validate.js");
        parseListParams = mod.parseListParams;
    });

    it("returns defaults for empty query", () => {
        const result = parseListParams({});
        expect(result).toStrictEqual({ limit: 24, offset: 0, search: null });
    });

    it("parses valid limit and offset", () => {
        const result = parseListParams({ limit: "10", offset: "5" });
        expect(result.limit).toBe(10);
        expect(result.offset).toBe(5);
    });

    it("clamps limit to 100 max", () => {
        const result = parseListParams({ limit: "999" });
        expect(result.limit).toBe(100);
    });

    it("clamps negative offset to 0", () => {
        const result = parseListParams({ offset: "-5" });
        expect(result.offset).toBe(0);
    });

    it("trims and normalizes search", () => {
        const result = parseListParams({ search: "  hello  " });
        expect(result.search).toBe("hello");
    });

    it("treats empty/whitespace search as null", () => {
        expect(parseListParams({ search: "" }).search).toBe(null);
        expect(parseListParams({ search: "   " }).search).toBe(null);
    });

    it("caps search length to 100 chars", () => {
        const long = "a".repeat(200);
        const result = parseListParams({ search: long });
        expect(result.search.length).toBe(100);
    });

    it("handles garbage limit/offset gracefully", () => {
        const result = parseListParams({ limit: "abc", offset: "xyz" });
        expect(result.limit).toBe(24);
        expect(result.offset).toBe(0);
    });
});
