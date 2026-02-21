import { useState, useEffect, useCallback } from 'react'
import { fetchOffers } from './api'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import OfferCard from './components/OfferCard'
import SkeletonCard from './components/SkeletonCard'
import EnebaLogo from './components/EnebaLogo'
import './App.css'

export default function App() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const [data, setData] = useState({ count: 0, items: [] })
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [errorMsg, setErrorMsg] = useState('')

  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = useCallback((offer) => {
    setCart(prev => [...prev, { ...offer, cartItemId: Date.now() + Math.random() }])
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }, [])

  const loadOffers = useCallback((searchTerm, signal) => {
    setStatus('loading')
    fetchOffers({ search: searchTerm || null, signal })
      .then((result) => {
        setData(result)
        setStatus('ready')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setErrorMsg(err.message)
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadOffers(debouncedSearch, controller.signal)
    return () => controller.abort()
  }, [debouncedSearch, loadOffers])

  const handleRetry = () => loadOffers(debouncedSearch)

  return (
    <div className="min-h-screen bg-[#411b9b] text-white font-sans">
      {/* Promo Top Bar */}
      <div className="bg-pink-500 py-[6px] flex items-center justify-center text-[12px] font-bold tracking-wide relative z-50">
        <EnebaLogo className="w-[14px] h-[14px] mr-2" />
        <span className="opacity-90">Games, Gift Cards, Top-Ups & More | Best Deals</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-[#411b9b]">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center gap-6">
          {/* Logo */}
          <a href="/" className="shrink-0 flex items-center mr-2 text-white">
            <EnebaLogo className="h-[36px] w-[36px]" />
            <span className="ml-2 text-2xl font-black tracking-tighter lowercase">eneba</span>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-2xl relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-[#33137f] border border-[#5a2ed1] hover:border-white focus:border-white rounded-md text-base text-white placeholder-gray-300 outline-none transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-5 ml-auto text-[13px] font-bold text-white tracking-wide shrink-0">
            <button className="flex items-center gap-3 hover:text-gray-300 transition-colors mr-2">
              <div className="w-6 h-6 rounded-full overflow-hidden flex flex-col shadow-sm border border-[#2a1061]">
                <div className="h-1/3 w-full bg-[#fdb913]"></div>
                <div className="h-1/3 w-full bg-[#006a44]"></div>
                <div className="h-1/3 w-full bg-[#c1272d]"></div>
              </div>
              <span style={{ fontFamily: 'Nunito, system-ui, sans-serif' }}>English EU | EUR</span>
            </button>
            <button className="text-white hover:text-gray-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="text-white hover:text-gray-300 transition-colors relative flex items-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#ffc220] text-[#120a28] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full z-10">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute top-10 right-0 w-80 bg-[#1f114c] border border-[#5a2ed1] shadow-2xl rounded-sm z-50 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-[#35157a] bg-[#1a0f3d] flex justify-between items-center">
                    <h4 className="text-white font-bold text-[14px]">Your Cart ({cart.length})</h4>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">Your cart is empty</div>
                    ) : (
                      <div className="flex flex-col">
                        {cart.map((item) => (
                          <div key={item.cartItemId} className="flex gap-3 p-3 border-b border-[#35157a] hover:bg-[#2a1a5c] transition-colors relative group">
                            <img src={item.image_url} alt={item.title} className="w-12 h-16 object-cover rounded-sm" />
                            <div className="flex flex-col flex-1 pr-6 tracking-tight">
                              <span className="text-[12px] font-bold text-white line-clamp-2 leading-tight">{item.title}</span>
                              <span className="text-[14px] font-extrabold text-white mt-auto">€{item.price_current.toFixed(2)}</span>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="absolute top-3 right-3 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 bg-[#1a0f3d] border-t border-[#35157a]">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-300 font-medium">Total:</span>
                        <span className="text-[18px] font-black text-white">€{cart.reduce((sum, item) => sum + item.price_current, 0).toFixed(2)}</span>
                      </div>
                      <button className="w-full bg-[#ffc220] hover:bg-[#ffb400] text-[#120a28] font-black text-[14px] py-2.5 rounded-sm transition-colors">
                        CHECKOUT
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="rounded-full overflow-hidden w-9 h-9 border-2 border-[#5a2ed1] hover:border-white transition-colors cursor-pointer bg-[#663b2f] flex justify-center items-center ml-1">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=663b2f" alt="Profile" className="w-[124%] h-[124%] object-cover" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[15px] font-medium text-gray-200">
            {status === 'ready' && debouncedSearch && (
              <>
                Results found: <span className="font-bold text-white">{data.count}</span>
              </>
            )}
            {status === 'loading' && 'Loading…'}
          </p>
        </div>

        {/* Error state */}
        {
          status === 'error' && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">{errorMsg || 'Something went wrong'}</p>
              <button
                onClick={handleRetry}
                className="px-5 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          )
        }

        {/* Grid */}
        {
          status !== 'error' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {status === 'loading'
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                : data.items.map((offer) => <OfferCard key={offer.id} offer={offer} onAddToCart={addToCart} />)
              }
            </div>
          )
        }

        {/* Empty state */}
        {
          status === 'ready' && data.items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" />
              </svg>
              <p className="text-gray-400 text-lg">No results found</p>
              <p className="text-gray-600 text-sm">Try a different search term</p>
            </div>
          )
        }
      </main>
    </div>
  )
}
