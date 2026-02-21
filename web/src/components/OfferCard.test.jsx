import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import OfferCard from './OfferCard'

const BASE_OFFER = {
    id: 1,
    game_name: 'Test Game',
    title: 'Test Game - Steam Key',
    platform: 'Steam',
    region: 'Global',
    currency: 'EUR',
    price_current: 19.99,
    price_original: null,
    discount_percent: null,
    has_cashback: 0,
    cashback_amount: 0,
    likes_count: 42,
    image_url: null,
}

describe('OfferCard', () => {
    it('renders likes count', () => {
        render(<OfferCard offer={BASE_OFFER} />)
        expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('renders cashback badge when has_cashback is true', () => {
        render(<OfferCard offer={{ ...BASE_OFFER, has_cashback: 1, cashback_amount: 1.5 }} />)
        expect(screen.getByText('Cashback')).toBeInTheDocument()
        expect(screen.getByText('Cashback: €1.50')).toBeInTheDocument()
    })

    it('does NOT render cashback badge when has_cashback is false', () => {
        render(<OfferCard offer={BASE_OFFER} />)
        expect(screen.queryByText('Cashback')).not.toBeInTheDocument()
    })

    it('renders original price and discount when provided', () => {
        render(
            <OfferCard
                offer={{ ...BASE_OFFER, price_original: 49.99, discount_percent: 60 }}
            />
        )
        expect(screen.getByText('From €49.99')).toBeInTheDocument()
        expect(screen.getByText('-60%')).toBeInTheDocument()
    })

    it('does NOT render original price or discount when absent', () => {
        render(<OfferCard offer={BASE_OFFER} />)
        expect(screen.queryByText(/From/)).not.toBeInTheDocument()
        expect(screen.queryByText(/-%/)).not.toBeInTheDocument()
    })

    it('renders title and current price', () => {
        render(<OfferCard offer={BASE_OFFER} />)
        expect(screen.getAllByText('Test Game - Steam Key').length).toBeGreaterThan(0)
        expect(screen.getByText('€19.99')).toBeInTheDocument()
    })
})
