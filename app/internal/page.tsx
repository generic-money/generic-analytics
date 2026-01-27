import Image from 'next/image'
import { mainnet } from 'viem/chains'

import { citrea } from '../../config/chains/citrea'
import * as dune from '../actions/dune'
import * as rpc from '../actions/rpc'
import ChangeInTimeBar from '../components/ChangeInTimeBar'
import UnitsInTimeLine from '../components/UnitsInTimeLine'
import VaultItem from '../components/VaultItem'
import MainValueItem from '../components/MainValueItem'
import ValueItem from '../components/ValueItem'
import { CONTRACTS } from '../../config/constants'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Internal() {
  const [
    // assets
    unitTotalSupply,
    citreaTotalSupply,
    // usdcVaultBalance,
    // usdtVaultBalance,
    // usdsVaultBalance,
    // vaults
    usdcTotalAssets,
    usdtTotalAssets,
    usdsTotalAssets,
    // usdcVaultAutoDepositThreshold,
    // usdtVaultAutoDepositThreshold,
    // usdsVaultAutoDepositThreshold,
    // usdcAdditionalAvailableAssets,
    // usdtAdditionalAvailableAssets,
    // usdsAdditionalAvailableAssets,
    // controller
    // usdcVaultSettings,
    // usdtVaultSettings,
    // usdsVaultSettings,
    // prices
    usdcPrice,
    usdtPrice,
    usdsPrice,
    // redemptionPrice
    redemptionPrice,
    // bridgeCoordinator
    statusPredeposits,
  ] = await Promise.all([
    rpc.fetchTotalSupply(CONTRACTS.ethereum.assets.unit, mainnet),
    rpc.fetchTotalSupply(CONTRACTS.citrea.assets.unit, citrea),
    // rpc.fetchBalanceOf(CONTRACTS.assets.usdc, CONTRACTS.vaults.usdc.address),
    // rpc.fetchBalanceOf(CONTRACTS.assets.usdt, CONTRACTS.vaults.usdt.address),
    // rpc.fetchBalanceOf(CONTRACTS.assets.usds, CONTRACTS.vaults.usds.address),

    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usds),
    // rpc.fetchAutoDepositThreshold(CONTRACTS.vaults.usdc),
    // rpc.fetchAutoDepositThreshold(CONTRACTS.vaults.usdt),
    // rpc.fetchAutoDepositThreshold(CONTRACTS.vaults.usds),
    // rpc.fetchAdditionalAvailableAssets(CONTRACTS.vaults.usdc),
    // rpc.fetchAdditionalAvailableAssets(CONTRACTS.vaults.usdt),
    // rpc.fetchAdditionalAvailableAssets(CONTRACTS.vaults.usds),

    // rpc.fetchVaultSettings(CONTRACTS.vaults.usdc),
    // rpc.fetchVaultSettings(CONTRACTS.vaults.usdt),
    // rpc.fetchVaultSettings(CONTRACTS.vaults.usds),

    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdc),
    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdt),
    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usds),

    rpc.fetchShareRedemptionPrice(),

    rpc.fetchTotalPredeposits(CONTRACTS.ethereum.predeposits.status.nickname),
  ])

  const unitsInTime = await dune.fetchUnitsInTime()
  const depositsInTime = await dune.fetchDepositsInTime()

  const totalVaultValue = usdcTotalAssets * usdcPrice + usdtTotalAssets * usdtPrice + usdsTotalAssets * usdsPrice
  const overcollateralization = (totalVaultValue * 100 / unitTotalSupply)

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-12 px-6 bg-white dark:bg-black sm:items-start">
        <h1 className="w-full mb-12 text-4xl font-bold text-zinc-900 dark:text-zinc-100">Generic Internal Analytics</h1>

        <div className="w-full mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MainValueItem
            label="Total GUSD"
            value={unitTotalSupply.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
          <MainValueItem
            label="Total Collateral Value"
            value={`$${totalVaultValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          />
          <MainValueItem
            label="Collateralization"
            value={`${overcollateralization.toFixed(4)}%`}
          />
          <MainValueItem
            label="GUSD Price"
            value={`$${redemptionPrice.toLocaleString('en-US', { maximumFractionDigits: 4 })}`}
          />
        </div>

        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Chains</h2>
        <div className="w-full mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueItem
            label='StatusL2 (Predeposit)'
            value={statusPredeposits.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
          <ValueItem
            label='Citrea'
            value={citreaTotalSupply.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
          <ValueItem
            label='Ethereum'
            value={(unitTotalSupply - (statusPredeposits + citreaTotalSupply)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
        </div>

        {/* Vault Balances Section */}
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Collateral</h2>
        <div className="w-full mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VaultItem
              assetMetadata={CONTRACTS.ethereum.assets.usdc.metadata}
              totalAssets={usdcTotalAssets}
              price={usdcPrice}
              vaultAddress={CONTRACTS.ethereum.vaults.usdc.address}
              strategyAddress={CONTRACTS.ethereum.vaults.usdc.strategy.address}
            />
            <VaultItem
              assetMetadata={CONTRACTS.ethereum.assets.usdt.metadata}
              totalAssets={usdtTotalAssets}
              price={usdtPrice}
              vaultAddress={CONTRACTS.ethereum.vaults.usdt.address}
              strategyAddress={CONTRACTS.ethereum.vaults.usdt.strategy.address}
            />
            <VaultItem
              assetMetadata={CONTRACTS.ethereum.assets.usds.metadata}
              totalAssets={usdsTotalAssets}
              price={usdsPrice}
              vaultAddress={CONTRACTS.ethereum.vaults.usds.address}
              strategyAddress={CONTRACTS.ethereum.vaults.usds.strategy.address}
            />
          </div>
        </div>

        {/* Units In Time Chart Section */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Unit Tokens (last 14 days)</h2>
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
                  data: unitsInTime.data.slice(-14).map(entry => ({
                    x: entry.time,
                    y: entry.units.toFixed(2)
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
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Deposits (last 14 days)</h2>
            {depositsInTime.executionEndedAt && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last Dune query updated: {new Date(depositsInTime.executionEndedAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm mb-12">
            <div style={{ height: '400px', width: '100%' }}>
              <ChangeInTimeBar
                data={depositsInTime.data.slice(-14).map(entry => ({
                  time: entry.time,
                  usdc: Number(entry.usdc).toFixed(0),
                  usdt: Number(entry.usdt).toFixed(0),
                  usds: Number(entry.usds).toFixed(0),
                }))}
                indexBy={'time'}
                keys={['usdc', 'usdt', 'usds']}
                colors={[
                  CONTRACTS.ethereum.assets.usdc.metadata.color,
                  CONTRACTS.ethereum.assets.usdt.metadata.color,
                  CONTRACTS.ethereum.assets.usds.metadata.color,
                ]}
              />
            </div>
          </div>
        </div>

        <footer className="w-full mt-auto pt-8 pb-4 flex items-center justify-center border-t border-zinc-200 dark:border-zinc-800">
          <Image
            src="/img/generic-logo.png"
            alt="Generic Protocol Logo"
            width={160}
            height={80}
            priority
          />
        </footer>
      </main>
    </div>
  );
}
