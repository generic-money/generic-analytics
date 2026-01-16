import * as dune from './actions/dune'
import * as rpc from './actions/rpc'

import ChangeInTimeBar from './components/ChangeInTimeBar'
import UnitsInTimeLine from './components/UnitsInTimeLine'
import VaultBalancesSection from './components/VaultBalancesSection'
import { buildVaultConfigs, getVaultColors } from './utils/vaults'
import { CONTRACTS } from '../config/constants'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
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
    usdcVaultAutoDepositThreshold,
    usdtVaultAutoDepositThreshold,
    usdsVaultAutoDepositThreshold,
    // controller
    usdcVaultSettings,
    usdtVaultSettings,
    usdsVaultSettings,
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
    rpc.fetchAutoDepositThreshold(CONTRACTS.vaults.usdc),
    rpc.fetchAutoDepositThreshold(CONTRACTS.vaults.usdt),
    rpc.fetchAutoDepositThreshold(CONTRACTS.vaults.usds),

    rpc.fetchVaultSettings(CONTRACTS.vaults.usdc),
    rpc.fetchVaultSettings(CONTRACTS.vaults.usdt),
    rpc.fetchVaultSettings(CONTRACTS.vaults.usds),

    rpc.fetchPrice(CONTRACTS.priceFeeds.usdc),
    rpc.fetchPrice(CONTRACTS.priceFeeds.usdt),
    rpc.fetchPrice(CONTRACTS.priceFeeds.usds),
  ])

  const unitsInTime = await dune.fetchUnitsInTime()
  const depositsInTime = await dune.fetchDepositsInTime()

  const totalVaultValue = usdcTotalAssets * usdcPrice + usdtTotalAssets * usdtPrice + usdsTotalAssets * usdsPrice
  const overcollateralization = (totalVaultValue * 100 / unitTotalSupply)

  // Build vault configurations using the new utility
  const vaults = buildVaultConfigs(
    {
      usdc: {
        totalAssets: usdcTotalAssets,
        vaultBalance: usdcVaultBalance,
        price: usdcPrice
      },
      usdt: {
        totalAssets: usdtTotalAssets,
        vaultBalance: usdtVaultBalance,
        price: usdtPrice
      },
      usds: {
        totalAssets: usdsTotalAssets,
        vaultBalance: usdsVaultBalance,
        price: usdsPrice
      }
    },
    {
      usdc: {
        maxCapacity: usdcVaultSettings.maxCapacity,
        maxProportionality: usdcVaultSettings.maxProportionality,
        minProportionality: usdcVaultSettings.minProportionality,
        automaticDepositThreshold: usdcVaultAutoDepositThreshold
      },
      usdt: {
        maxCapacity: usdtVaultSettings.maxCapacity,
        maxProportionality: usdtVaultSettings.maxProportionality,
        minProportionality: usdtVaultSettings.minProportionality,
        automaticDepositThreshold: usdtVaultAutoDepositThreshold
      },
      usds: {
        maxCapacity: usdsVaultSettings.maxCapacity,
        maxProportionality: usdsVaultSettings.maxProportionality,
        minProportionality: usdsVaultSettings.minProportionality,
        automaticDepositThreshold: usdsVaultAutoDepositThreshold
      }
    }
  )

  const colors = getVaultColors()

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-12 px-6 bg-white dark:bg-black sm:items-start">
        <div className="w-full mb-12">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Generic Internal Analytics</h1>
        </div>

        {/* Total Unit Tokens Section */}
        <div className="w-full mb-12">
          <div className="bg-gradient-to-br from-[#3F79FF] to-[#3F79FF]/70 rounded-2xl p-8 shadow-lg">
            <div className="text-white/80 text-sm font-medium mb-2">Total Unit Tokens</div>
            <div className="text-white text-5xl font-bold mb-4">
              {unitTotalSupply.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div>
                <span className="text-sm">Total Collateral Value: </span>
                <span className="text-xl font-semibold">${totalVaultValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="h-6 w-px bg-white/30"></div>
              <div>
                <span className="text-sm">Collateralization: </span>
                <span className="text-xl font-semibold">{overcollateralization.toFixed(4)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vault Balances Section */}
        <VaultBalancesSection vaults={vaults} />

        {/* Units In Time Chart Section */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Unit Tokens</h2>
            {unitsInTime.executionEndedAt && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last Dune query updated: {new Date(unitsInTime.executionEndedAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div style={{ height: '400px', width: '100%' }}>
              <UnitsInTimeLine data={[
                  {
                    id: 'Unit Tokens',
                    color: '#3F79FF',
                    data: unitsInTime.data.map(entry => ({
                      x: entry.time,
                      y: entry.units
                    }))
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Historical Chart Section */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Daily deposits</h2>
            {depositsInTime.executionEndedAt && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last Dune query updated: {new Date(depositsInTime.executionEndedAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div style={{ height: '400px', width: '100%' }}>
              <ChangeInTimeBar
                data={depositsInTime.data}
                indexBy={'time'}
                keys={['usdc', 'usdt', 'usds']}
                colors={[
                  colors.usdc,
                  colors.usdt,
                  colors.usds,
                ]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
