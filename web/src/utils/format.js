/**
 * Format a number as EUR currency.
 * @param {number} amount
 * @returns {string}
 */
export function formatPrice(amount) {
    if (amount == null) return '—'
    return `€${Number(amount).toFixed(2)}`
}
