'use client'

import { VaultRewardsData } from './types'
import { CONTRACTS } from '@/config/constants'
import { buildAndDownloadSellTx } from './buildSellTx'

interface VaultRewardsCardProps {
  vaultData: VaultRewardsData;
}

export default function VaultRewardsCard({ vaultData }: VaultRewardsCardProps) {
  const hasRewards = vaultData.rewards.length > 0

  const getTokenIcon = (address: string) => {
    if (address === CONTRACTS.ethereum.assets.morpho.address) {
      return CONTRACTS.ethereum.assets.morpho.metadata.iconSrc
    }
    return ''
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Vault Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: vaultData.asset.metadata.color + '20' }}
        >
          <img src={vaultData.asset.metadata.iconSrc} alt={vaultData.vaultName} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {vaultData.vaultName.replace(' Vault', '')}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {vaultData.vaultName}
          </p>
        </div>
      </div>

      {/* Vault Address */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Vault Address</span>
          <a
            href={`https://eth.blockscout.com/address/${vaultData.vaultAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline"
          >
            {vaultData.vaultAddress.slice(0, 6)}...{vaultData.vaultAddress.slice(-4)}
          </a>
        </div>
      </div>

      {/* Reward Asset Sub-cards */}
      <div className="space-y-3">
        {hasRewards ? (
          vaultData.rewards.map((reward, idx) => {
            const tokenAddress = reward.token.address
            const tokenIcon = getTokenIcon(tokenAddress)

            return (
              <div
                key={idx}
                className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4"
              >
                {/* Token Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                    <img src={tokenIcon} alt={reward.token.symbol} className="w-8 h-8 rounded-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {reward.token.symbol}
                    </h4>
                    <a
                      href={`https://eth.blockscout.com/address/${tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
                    </a>
                  </div>
                </div>

                {/* Token Balances */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Claimed</span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {reward.claimed.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-zinc-700" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Claimable</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {(reward.amount - reward.claimed).toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        (${((reward.amount - reward.claimed) * reward.token.price).toLocaleString(undefined, { maximumFractionDigits: 2 })})
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Owned</span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {reward.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        (${(reward.balance * reward.token.price).toLocaleString(undefined, { maximumFractionDigits: 2 })})
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`https://app.merkl.xyz/users/${vaultData.vaultAddress}`, '_blank')}
                    className="flex-1 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors"
                  >
                    Claim
                  </button>
                  <button
                    onClick={async () => {
                      await buildAndDownloadSellTx(
                        tokenAddress as `0x${string}`,
                        vaultData.vaultAddress as `0x${string}`,
                        vaultData.vaultKey,
                        BigInt(Math.floor(reward.balance * Math.pow(10, reward.token.decimals))),
                        vaultData.asset.address as `0x${string}`
                      )
                    }}
                    className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={reward.balance === 0}
                  >
                    Sell
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            No rewards available
          </div>
        )}
      </div>
    </div>
  )
}
