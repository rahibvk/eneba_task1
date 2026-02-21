// In production, VITE_API_BASE_URL may be legally omitted/empty to trigger relative paths (e.g., "/api/list").
// We use ?? to allow empty strings instead of reverting to the fallback.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

/**
 * Fetch offers from the API.
 * @param {Object} opts
 * @param {string|null} opts.search
 * @param {number} opts.limit
 * @param {number} opts.offset
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<{count: number, items: any[]}>}
 */
export async function fetchOffers({ search = null, limit = 24, offset = 0, signal } = {}) {
    const params = new URLSearchParams()
    params.set('limit', String(limit))
    params.set('offset', String(offset))
    if (search) params.set('search', search)

    const url = `${API_BASE_URL.replace(/\/$/, '')}/list?${params.toString()}`

    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error('Request failed')
    return res.json()
}
