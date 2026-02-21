import { useState, useEffect } from 'react'

/**
 * Debounce a value by `delay` ms.
 * @param {any} value
 * @param {number} delay
 * @returns {any} debounced value
 */
export function useDebouncedValue(value, delay = 300) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}
