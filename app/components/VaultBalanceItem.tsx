import Tooltip from './Tooltip';

interface VaultBalanceItemProps {
    symbol: string;
    name: string;
    color: string;
    icon: React.ReactNode;
    totalAssets: number;
    price: number;
}

export default function VaultBalanceItem({ symbol, name, color, icon, totalAssets, price }: VaultBalanceItemProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                <span className="text-2xl font-bold" style={{ color: color }}>{icon}</span>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{symbol}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{name}</p>
            </div>
            </div>
            <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Balance</span>
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {totalAssets.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Oracle Price</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                ${price.toFixed(4)}
                </span>
            </div>

            {/* Slippage Section */}
            <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Deposit Slippage</span>
                        <Tooltip text="User $ loss when minting GUSD" />
                    </div>
                    <span className={`text-xs font-medium text-zinc-500 dark:text-zinc-400`}>
                    {(price <= 1 ? 0 : (price - 1) * 100).toFixed(4)}%
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Redeem Slippage</span>
                        <Tooltip text="User $ loss when redeeming GUSD." />
                    </div>
                    <span className={`text-xs font-medium text-zinc-500 dark:text-zinc-400`}>
                    {(price >= 1 ? 0 : (1 - price) * 100).toFixed(4)}%
                    </span>
                </div>
                </div>
            </div>

            <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Value</span>
                <span className="text-xl font-bold" style={{ color: color }}>
                    ${(totalAssets * price).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
                </div>
            </div>
            </div>
        </div>
    )
}
