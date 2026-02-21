export default function SkeletonCard() {
    return (
        <div className="flex flex-col rounded-2xl bg-[#1a1d2e] border border-[#2a2d3e] overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-[#22253a]" />
            <div className="p-3 space-y-2">
                <div className="h-4 bg-[#22253a] rounded w-full" />
                <div className="h-4 bg-[#22253a] rounded w-3/4" />
                <div className="h-3 bg-[#22253a] rounded w-1/3 mt-2" />
                <div className="flex justify-between items-end pt-2 border-t border-[#2a2d3e] mt-2">
                    <div className="h-6 bg-[#22253a] rounded w-16" />
                    <div className="h-4 bg-[#22253a] rounded w-10" />
                </div>
            </div>
        </div>
    )
}
