/**
 * Parse and clamp pagination / search query parameters.
 */

const LIMIT_DEFAULT = 24;
const LIMIT_MAX = 100;
const SEARCH_MAX_LEN = 100;

function parseListParams(query) {
    let limit = parseInt(query.limit, 10);
    if (!Number.isFinite(limit) || limit < 1) limit = LIMIT_DEFAULT;
    if (limit > LIMIT_MAX) limit = LIMIT_MAX;

    let offset = parseInt(query.offset, 10);
    if (!Number.isFinite(offset) || offset < 0) offset = 0;

    let search = (query.search || "").trim();
    if (search.length > SEARCH_MAX_LEN) search = search.slice(0, SEARCH_MAX_LEN);
    if (search.length === 0) search = null;

    return { limit, offset, search };
}

module.exports = { parseListParams };
