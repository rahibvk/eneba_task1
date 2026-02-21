import { useState } from 'react'
import { formatPrice } from '../utils/format'



export default function OfferCard({ offer, onAddToCart }) {
    const [imgError, setImgError] = useState(false)

    const platformColor = (() => {
        if (!offer.platform) return 'bg-[#1b2838]' // default dark
        const p = offer.platform.toLowerCase()
        if (p.includes('xbox')) return 'bg-[#107c10]'
        if (p.includes('nintendo')) return 'bg-[#e60012]'
        if (p.includes('ea')) return 'bg-[#eb5c27]'
        if (p.includes('steam')) return 'bg-[#1b2838]'
        if (p.includes('epic')) return 'bg-[#313131]'
        return 'bg-[#1b2838]'
    })()

    const {
        title,
        platform,
        region,
        price_current,
        price_original,
        discount_percent,
        has_cashback,
        cashback_amount,
        likes_count,
        image_url,
    } = offer

    return (
        <div className="group relative flex flex-col h-full bg-[#1f114c] border border-[#5229c6] overflow-hidden transition-all duration-300 hover:-translate-y-1">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-[#120a28]">
                {imgError || !image_url ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a103c] to-[#2a1a5c] flex items-center justify-center p-4 text-center">
                        <span className="text-gray-400 font-bold text-sm opacity-60 leading-tight">{title}</span>
                    </div>
                ) : (
                    <img
                        src={image_url}
                        alt={title}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                )}

                {/* Cashback badge (Bottom Left of Image, right above platform bar) */}
                <div className="absolute bottom-6 left-0 bg-[#4EE1A0] text-[#0A2619] text-[10px] font-extrabold tracking-[0.02em] px-2 py-1 flex items-center gap-1 shrink-0 leading-none z-10 rounded-tr-sm rounded-br-sm">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.874-6.494c2.81 0 4.707-1.42 5.09-3.95H10.13c-.15 1.51-1.22 2.37-2.61 2.37-1.46 0-2.3-1.05-2.3-3.15 0-2.14.8-3.32 2.45-3.32 1.35 0 2.22.95 2.4 2.51h4.94A5.022 5.022 0 0010.27 5.7c-4.47 0-7.65 2.53-7.65 6.3 0 3.82 3.19 6.42 7.7 6.42l-.194-2.914z" />
                    </svg>
                    CASHBACK
                </div>

                {/* Platform bar (Full width bottom of image) */}
                {platform && (
                    <div className={`absolute bottom-0 left-0 right-0 h-6 ${platformColor} text-white/90 text-[10px] font-bold tracking-wider px-2 flex items-center justify-center gap-1.5 backdrop-blur-sm z-10 border-t border-white/10`}>
                        {platform.toLowerCase().includes('ea') ? (
                            <div className="w-3.5 h-3.5 rounded-full bg-[#f34f21] flex items-center justify-center border border-[#f34f21]" />
                        ) : platform.toLowerCase().includes('xbox') ? (
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm6.237 5.763c-.004 0-1.776 5.892-6.198 8.448-4.38-2.534-6.195-8.448-6.195-8.448 3.968 1.488 6.195 4.545 6.195 4.545s2.215-3.057 6.198-4.545zm-14.07 4.237c0-1.516.48-2.924 1.258-4.085.808 3.513 3.655 7.025 6.55 8.788-3.92-1.04-7.808-4.703-7.808-4.703zM12 20.25c-2.31 0-4.37-.96-5.875-2.5.586-.53 2.146-1.895 5.875-1.895 3.73 0 5.29 1.365 5.875 1.895C16.37 19.29 14.31 20.25 12 20.25zm5.834-4.582c3.078-1.782 5.925-5.32 6.702-8.788.778 1.16 1.258 2.568 1.258 4.085 0 0-3.888 3.663-7.96 4.703z" /></svg>
                        ) : platform.toLowerCase().includes('nintendo') ? (
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M11 2.2C6.1 2.2 2.2 6.1 2.2 11S6.1 19.8 11 19.8V2.2zm-2.8 5.7A1.6 1.6 0 118.2 11 1.6 1.6 0 018.2 7.9zm4.8-5.7v17.6c4.9 0 8.8-3.9 8.8-8.8S17.9 2.2 13 2.2zm2.8 8.8A1.6 1.6 0 1115.8 11 1.6 1.6 0 0115.8 11z" /></svg>
                        ) : null}
                        {platform}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-3.5 gap-1.5 relative">
                {/* Title */}
                <h3 className="text-[12px] font-bold text-white leading-tight line-clamp-2 min-h-[2rem]">
                    {title}
                </h3>

                {/* Region tag */}
                {region && (
                    <span className="text-[10px] font-bold uppercase text-[#3ed598] tracking-wide mt-0.5">
                        {region}
                    </span>
                )}

                {/* Spacer */}
                <div className="flex-1 min-h-[12px]" />

                {/* Price area */}
                <div className="mt-1 flex flex-col transition-opacity duration-300 group-hover:-translate-y-8">
                    <div className="flex items-center gap-1.5 min-h-[16px]">
                        {price_original && price_original !== price_current && (
                            <div className="flex items-center gap-1">
                                <span className="text-[11px] font-semibold text-[#8a8a9d]">From</span>
                                <span className="text-[11px] font-semibold text-[#8a8a9d] line-through">
                                    {formatPrice(price_original)}
                                </span>
                                {discount_percent && (
                                    <span className="text-[11px] font-bold text-[#3ed598]">
                                        -{discount_percent}%
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-[22px] font-extrabold text-white tracking-tight leading-none mb-0.5">
                            {formatPrice(price_current)}
                        </span>
                        <svg className="w-[14px] h-[14px] text-[#8a8a9d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11v4m0-8h.01" />
                        </svg>
                    </div>

                    {/* Cashback amount */}
                    <p className="text-[10px] font-bold text-[#4EE1A0] mt-0.5 tracking-wide">
                        Cashback: {formatPrice(cashback_amount || 4.50)}
                    </p>

                    {/* Likes */}
                    <div className="flex items-center gap-1 text-[#8a8a9d] mt-2.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-[12px] font-medium">{likes_count}</span>
                    </div>
                </div>
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-3.5 bg-gradient-to-t from-[#1f114c] via-[#1f114c] to-transparent translate-y-[110%] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col gap-2.5 shadow-[0_-12px_24px_rgba(31,17,76,1)]">
                <button
                    onClick={(e) => { e.preventDefault(); onAddToCart && onAddToCart(offer); }}
                    className="w-full bg-[#ffc220] hover:bg-[#ffb400] text-[#120a28] font-black tracking-wide text-[13px] py-2.5 rounded-sm transition-colors text-center shadow-md active:scale-[0.98]"
                >
                    ADD TO CART
                </button>
                <button className="w-full border border-white hover:bg-white/10 text-white font-black tracking-wide text-[13px] py-2.5 rounded-sm transition-colors text-center active:scale-[0.98]">
                    EXPLORE OPTIONS
                </button>
            </div>
        </div>
    )
}
