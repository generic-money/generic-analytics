import * as rpc from '@/app/actions/rpc'

import VaultBalancesSection from '../components/VaultBalancesSection'
import { buildVaultConfigs } from '../utils/vaults'
import { CONTRACTS } from '@/config/constants'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProofOfReserves() {
  const [
    // assets
    unitTotalSupply,
    usdcVaultBalance,
    usdtVaultBalance,
    usdsVaultBalance,
    // vaults
    usdcTotalAssets,
    usdtTotalAssets,
    usdsTotalAssets,
    usdcAdditionalAvailableAssets,
    usdtAdditionalAvailableAssets,
    usdsAdditionalAvailableAssets,
    // prices
    usdcPrice,
    usdtPrice,
    usdsPrice,
  ] = await Promise.all([
    rpc.fetchTotalSupply(CONTRACTS.assets.unit),
    rpc.fetchBalanceOf(CONTRACTS.assets.usdc, CONTRACTS.vaults.usdc.address),
    rpc.fetchBalanceOf(CONTRACTS.assets.usdt, CONTRACTS.vaults.usdt.address),
    rpc.fetchBalanceOf(CONTRACTS.assets.usds, CONTRACTS.vaults.usds.address),

    rpc.fetchTotalAssets(CONTRACTS.vaults.usdc),
    rpc.fetchTotalAssets(CONTRACTS.vaults.usdt),
    rpc.fetchTotalAssets(CONTRACTS.vaults.usds),
    rpc.fetchAdditionalAvailableAssets(CONTRACTS.vaults.usdc, CONTRACTS.vaults.usdc.strategy),
    rpc.fetchAdditionalAvailableAssets(CONTRACTS.vaults.usdt, CONTRACTS.vaults.usdt.strategy),
    rpc.fetchAdditionalAvailableAssets(CONTRACTS.vaults.usds, CONTRACTS.vaults.usds.strategy),

    rpc.fetchPrice(CONTRACTS.priceFeeds.usdc),
    rpc.fetchPrice(CONTRACTS.priceFeeds.usdt),
    rpc.fetchPrice(CONTRACTS.priceFeeds.usds),
  ])

  const totalVaultValue = usdcTotalAssets * usdcPrice + usdtTotalAssets * usdtPrice + usdsTotalAssets * usdsPrice
  const overcollateralization = (totalVaultValue * 100 / unitTotalSupply)

  // Build vault configurations using the new utility (without settings for proof-of-reserves)
  const vaults = buildVaultConfigs({
    usdc: {
      totalAssets: usdcTotalAssets,
      vaultBalance: usdcVaultBalance,
      price: usdcPrice,
      availableLiquidity: usdcVaultBalance + usdcAdditionalAvailableAssets
    },
    usdt: {
      totalAssets: usdtTotalAssets,
      vaultBalance: usdtVaultBalance,
      price: usdtPrice,
      availableLiquidity: usdtVaultBalance + usdtAdditionalAvailableAssets
    },
    usds: {
      totalAssets: usdsTotalAssets,
      vaultBalance: usdsVaultBalance,
      price: usdsPrice,
      availableLiquidity: usdsVaultBalance + usdsAdditionalAvailableAssets
    }
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-12 px-6 bg-white dark:bg-black sm:items-start">
        <div className="w-full mb-12">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Generic Protocol - Proof of Reserves</h1>
        </div>

        {/* Total Units, Collateral Value, and Collateralization Section */}
        <div className="w-full mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Unit Tokens */}
          <div className="bg-gradient-to-br from-[#3F79FF] to-[#3F79FF]/70 rounded-2xl p-6 shadow-lg">
            <div className="text-white/80 text-sm font-medium mb-2">Total Unit Tokens</div>
            <div className="text-white text-3xl font-bold">
              {unitTotalSupply.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Total Collateral Value */}
          <div className="bg-gradient-to-br from-[#3F79FF] to-[#3F79FF]/70 rounded-2xl p-6 shadow-lg">
            <div className="text-white/80 text-sm font-medium mb-2">Total Collateral Value</div>
            <div className="text-white text-3xl font-bold">
              ${totalVaultValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Collateralization */}
          <div className="bg-gradient-to-br from-[#3F79FF] to-[#3F79FF]/70 rounded-2xl p-6 shadow-lg">
            <div className="text-white/80 text-sm font-medium mb-2">Collateralization</div>
            <div className="text-white text-3xl font-bold">
              {overcollateralization.toFixed(4)}%
            </div>
          </div>
        </div>

        {/* Vault Balances Section */}
        <VaultBalancesSection
          vaults={vaults}
          showBasicInfoOnly={true}
        />
      </main>
    </div>
  );
}
