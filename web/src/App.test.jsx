import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

/** Build a mock Response for fetch */
function mockResponse(data) {
    return {
        ok: true,
        json: () => Promise.resolve(data),
    }
}

const MOCK_LIST = {
    count: 2,
    items: [
        {
            id: 1, game_name: 'Alpha', title: 'Alpha - Key', platform: 'Steam',
            region: 'Global', currency: 'EUR', price_current: 9.99,
            price_original: null, discount_percent: null,
            has_cashback: 0, cashback_amount: 0, likes_count: 10, image_url: null,
        },
        {
            id: 2, game_name: 'Beta', title: 'Beta - Key', platform: 'GOG',
            region: 'Europe', currency: 'EUR', price_current: 14.99,
            price_original: 29.99, discount_percent: 50,
            has_cashback: 1, cashback_amount: 0.75, likes_count: 20, image_url: null,
        },
    ],
}

const EMPTY_LIST = { count: 0, items: [] }

describe('App', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true })
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    it('fetches /list on mount and shows results count', async () => {
        fetch.mockResolvedValueOnce(mockResponse(MOCK_LIST))

        await act(async () => {
            render(<App />)
            // Advance past the debounce timer (initial empty search)
            vi.advanceTimersByTime(350)
        })

        await waitFor(() => {
            expect(screen.getByText('2')).toBeInTheDocument()
            expect(screen.getByText(/results found/)).toBeInTheDocument()
        })

        // Verify fetch was called with /list
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/list'),
            expect.any(Object)
        )
    })

    it('debounces search input and fetches with search param', async () => {
        // First call: initial mount
        fetch.mockResolvedValueOnce(mockResponse(MOCK_LIST))

        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

        await act(async () => {
            render(<App />)
            vi.advanceTimersByTime(350)
        })

        await waitFor(() => {
            expect(screen.getByText(/results found/)).toBeInTheDocument()
        })

        // Second call: search results
        fetch.mockResolvedValueOnce(mockResponse({ count: 1, items: [MOCK_LIST.items[0]] }))

        const input = screen.getByPlaceholderText('Search games…')
        await user.type(input, 'alpha')

        // fetch should NOT have been called again yet (still within debounce)
        const callCountBeforeDebounce = fetch.mock.calls.length

        await act(async () => {
            vi.advanceTimersByTime(350)
        })

        await waitFor(() => {
            // After debounce, fetch should have been called again
            expect(fetch.mock.calls.length).toBeGreaterThan(callCountBeforeDebounce)
            // The last call should include search param
            const lastCallUrl = fetch.mock.calls[fetch.mock.calls.length - 1][0]
            expect(lastCallUrl).toContain('search=alpha')
        })
    })

    it('shows "No results" for empty search results', async () => {
        fetch.mockResolvedValueOnce(mockResponse(EMPTY_LIST))

        await act(async () => {
            render(<App />)
            vi.advanceTimersByTime(350)
        })

        await waitFor(() => {
            expect(screen.getByText('No results found')).toBeInTheDocument()
        })
    })
    it('shows error UI and refetches on retry', async () => {
        // First call fails
        fetch.mockRejectedValueOnce(new Error('Network error'))

        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

        await act(async () => {
            render(<App />)
            vi.advanceTimersByTime(350)
        })

        await waitFor(() => {
            expect(screen.getByText('Network error')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
        })

        // Setup second call to succeed
        fetch.mockResolvedValueOnce(mockResponse(MOCK_LIST))

        // Click retry
        await user.click(screen.getByRole('button', { name: 'Retry' }))

        await waitFor(() => {
            expect(screen.getByText('2')).toBeInTheDocument()
            expect(screen.getByText(/results found/)).toBeInTheDocument()
            expect(screen.queryByText('Network error')).not.toBeInTheDocument()
        })

        // fetch called twice
        expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('ignores AbortError', async () => {
        const abortError = new Error('The operation was aborted')
        abortError.name = 'AbortError'

        // Return an AbortError as if the signal aborted
        fetch.mockRejectedValueOnce(abortError)

        await act(async () => {
            render(<App />)
            vi.advanceTimersByTime(350)
        })

        // We can't really wait for nothing to happen, but we can verify our error states aren't shown
        // Wait a tick for promises to reject
        await act(async () => {
            await Promise.resolve()
        })

        expect(screen.queryByText(/Something went wrong|The operation was aborted/)).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument()
    })
})
