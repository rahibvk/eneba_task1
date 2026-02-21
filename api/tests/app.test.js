import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import request from 'supertest'

describe('App Production Behavior', () => {
    let originalEnv;

    beforeEach(() => {
        originalEnv = process.env;
        process.env = { ...originalEnv };
        vi.resetModules();
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    it('GET /api/health returns 200 and { ok: true }', async () => {
        const app = require('../src/app.js');
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });

    it('SPA fallback: returns HTML for unknown routes in production', async () => {
        process.env.NODE_ENV = 'production';
        const app = (await import('../src/app.js')).default;

        const res = await request(app).get('/some/random/path');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/text\/html/);
        expect(res.text).toContain('<!doctype html>');
    });

    it('SPA fallback does NOT intercept /api routes', async () => {
        process.env.NODE_ENV = 'production';
        const app = (await import('../src/app.js')).default;

        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    it('CORS: allows permitted origins in production', async () => {
        process.env.NODE_ENV = 'production';
        process.env.CORS_ORIGIN = 'https://allowed.com,http://another.com';
        const app = (await import('../src/app.js')).default;

        const res = await request(app)
            .get('/api/health')
            .set('Origin', 'https://allowed.com');

        expect(res.status).toBe(200);
        expect(res.headers['access-control-allow-origin']).toBe('https://allowed.com');
    });

    it('CORS: blocks disallowed origins in production', async () => {
        process.env.NODE_ENV = 'production';
        process.env.CORS_ORIGIN = 'https://allowed.com';
        const app = (await import('../src/app.js')).default;

        const res = await request(app)
            .get('/api/health')
            .set('Origin', 'https://evil.com');

        // Express error middleware catches the CORS error and returns 500
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Internal Server Error');
    });
});
