import Image from 'next/image'
import { mainnet } from 'viem/chains'

import { citrea } from '../../config/chains/citrea'
import * as dune from '../actions/dune'
import * as rpc from '../actions/rpc'
import * as rest from '../actions/rest'
import ChangeInTimeBar from '../components/ChangeInTimeBar'
import UnitsInTimeLine from '../components/UnitsInTimeLine'
import VaultItem from '../components/VaultItem'
import MainValueItem from '../components/MainValueItem'
import ValueItem from '../components/ValueItem'
import { CONTRACTS } from '../../config/constants'
import type { VaultItemMandatoryProps, VaultItemInternalProps } from '../components/VaultItem'
import { AssetKey } from 'node:sea'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Internal() {
  const [
    // assets
    unitTotalSupply,
    citreaTotalSupply,
    citreaStakedGusdSupply,
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
    usdcAdditionalAvailableAssets,
    usdtAdditionalAvailableAssets,
    usdsAdditionalAvailableAssets,
    // controller
    usdcVaultSettings,
    usdtVaultSettings,
    usdsVaultSettings,
    // prices
    usdcPrice,
    usdtPrice,
    usdsPrice,
    // bridgeCoordinator
    statusPredeposits,
    // morpho
    usdcStrategyData,
    usdtStrategyData,
    usdsSSR,

    usdcRewards,
    usdtRewards,
    usdsRewards,
  ] = await Promise.all([
    rpc.fetchTotalSupply(CONTRACTS.ethereum.assets.unit, mainnet),
    rpc.fetchTotalSupply(CONTRACTS.citrea.assets.unit, citrea),
    rpc.fetchTotalSupply(CONTRACTS.citrea.assets.sgusd, citrea),
    rpc.fetchBalanceOf(CONTRACTS.ethereum.assets.usdc, CONTRACTS.ethereum.vaults.usdc.address),
    rpc.fetchBalanceOf(CONTRACTS.ethereum.assets.usdt, CONTRACTS.ethereum.vaults.usdt.address),
    rpc.fetchBalanceOf(CONTRACTS.ethereum.assets.usds, CONTRACTS.ethereum.vaults.usds.address),

    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchTotalAssets(CONTRACTS.ethereum.vaults.usds),
    rpc.fetchAutoDepositThreshold(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchAutoDepositThreshold(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchAutoDepositThreshold(CONTRACTS.ethereum.vaults.usds),
    rpc.fetchAdditionalAvailableAssets(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchAdditionalAvailableAssets(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchAdditionalAvailableAssets(CONTRACTS.ethereum.vaults.usds),

    rpc.fetchVaultSettings(CONTRACTS.ethereum.vaults.usdc),
    rpc.fetchVaultSettings(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchVaultSettings(CONTRACTS.ethereum.vaults.usds),

    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdc),
    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usdt),
    rpc.fetchPrice(CONTRACTS.ethereum.priceFeeds.usds),

    rpc.fetchTotalPredeposits(CONTRACTS.ethereum.predeposits.status.nickname),

    rest.fetchMorphoVaultV1(CONTRACTS.ethereum.vaults.usdc),
    rest.fetchMorphoVaultV1(CONTRACTS.ethereum.vaults.usdt),
    rpc.fetchSSR(),

    rest.fetchMerkleRewards(CONTRACTS.ethereum.vaults.usdc),
    rest.fetchMerkleRewards(CONTRACTS.ethereum.vaults.usdt),
    rest.fetchMerkleRewards(CONTRACTS.ethereum.vaults.usds),
  ])

  const unitsInTime = await dune.fetchUnitsInTime()
  const depositsInTime = await dune.fetchDepositsInTime()
  const depositsPerTx = await dune.fetchDepositsPerTx()

  const totalVaultValue = usdcTotalAssets * usdcPrice + usdtTotalAssets * usdtPrice + usdsTotalAssets * usdsPrice
  const overcollateralization = (totalVaultValue * 100 / unitTotalSupply)

  const vaultsData = {
    usdc: {
      assetMetadata: CONTRACTS.ethereum.assets.usdc.metadata,
      totalAssets: usdcTotalAssets,
      price: usdcPrice,
      vaultAddress: CONTRACTS.ethereum.vaults.usdc.address,
      strategyAddress: CONTRACTS.ethereum.vaults.usdc.strategy.address,
      apy: usdcStrategyData.data.vaultByAddress.state.avgNetApy * 100,
      allocated: (usdcTotalAssets - usdcVaultBalance) / usdcTotalAssets * 100,
      available: (usdcAdditionalAvailableAssets + usdcVaultBalance) / usdcTotalAssets * 100,
      currentProportionality: (usdcTotalAssets * usdcPrice) / totalVaultValue * 100,
    },
    usdt: {
      assetMetadata: CONTRACTS.ethereum.assets.usdt.metadata,
      totalAssets: usdtTotalAssets,
      price: usdtPrice,
      vaultAddress: CONTRACTS.ethereum.vaults.usdt.address,
      strategyAddress: CONTRACTS.ethereum.vaults.usdt.strategy.address,
      apy: usdtStrategyData.data.vaultByAddress.state.avgNetApy * 100,
      allocated: (usdtTotalAssets - usdtVaultBalance) / usdtTotalAssets * 100,
      available: (usdtAdditionalAvailableAssets + usdtVaultBalance) / usdtTotalAssets * 100,
      currentProportionality: (usdtTotalAssets * usdtPrice) / totalVaultValue * 100,
    },
    usds: {
      assetMetadata: CONTRACTS.ethereum.assets.usds.metadata,
      totalAssets: usdsTotalAssets,
      price: usdsPrice,
      vaultAddress: CONTRACTS.ethereum.vaults.usds.address,
      strategyAddress: CONTRACTS.ethereum.vaults.usds.strategy.address,
      apy: usdsSSR * 100,
      allocated: (usdsTotalAssets - usdsVaultBalance) / usdsTotalAssets * 100,
      available: (usdsAdditionalAvailableAssets + usdsVaultBalance) / usdsTotalAssets * 100,
      currentProportionality: (usdsTotalAssets * usdsPrice) / totalVaultValue * 100,
    }
  } as Record<AssetKey, VaultItemMandatoryProps>

  const internalVaultsData = {
    usdc: {
      rewards: usdcRewards,
      mintSlippage: usdcPrice <= 1 ? 0 : (usdcPrice - 1) * 100,
      redeemSlippage: usdcPrice >= 1 ? 0 : (1 - usdcPrice) * 100,
      maxCapacity: usdcVaultSettings.maxCapacity,
      minProportionality: usdcVaultSettings.minProportionality,
      maxProportionality: usdcVaultSettings.maxProportionality,
      autodepositThreshold: usdcVaultAutoDepositThreshold,
    },
    usdt: {
      rewards: usdtRewards,
      mintSlippage: usdtPrice <= 1 ? 0 : (usdtPrice - 1) * 100,
      redeemSlippage: usdtPrice >= 1 ? 0 : (1 - usdtPrice) * 100,
      maxCapacity: usdtVaultSettings.maxCapacity,
      minProportionality: usdtVaultSettings.minProportionality,
      maxProportionality: usdtVaultSettings.maxProportionality,
      autodepositThreshold: usdtVaultAutoDepositThreshold,
    },
    usds: {
      rewards: usdsRewards,
      mintSlippage: usdsPrice <= 1 ? 0 : (usdsPrice - 1) * 100,
      redeemSlippage: usdsPrice >= 1 ? 0 : (1 - usdsPrice) * 100,
      maxCapacity: usdsVaultSettings.maxCapacity,
      minProportionality: usdsVaultSettings.minProportionality,
      maxProportionality: usdsVaultSettings.maxProportionality,
      autodepositThreshold: usdsVaultAutoDepositThreshold,
    },
  } as Record<AssetKey, VaultItemInternalProps>

  const protocolApy = vaultsData.usdc.apy * vaultsData.usdc.currentProportionality / 100
                    + vaultsData.usdt.apy * vaultsData.usdt.currentProportionality / 100
                    + vaultsData.usds.apy * vaultsData.usds.currentProportionality / 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-6 px-6 bg-white dark:bg-black sm:items-start">
        <h1 className="w-full my-12 text-4xl font-bold text-zinc-900 dark:text-zinc-100">Generic Internal Analytics</h1>

        {/* Main Section */}
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
            label="Protocol APY"
            value={`${protocolApy.toFixed(4)}%`}
          />
        </div>

        {/* Vault Balances Section */}
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Collateral</h2>
        <div className="w-full mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VaultItem
              mandatory={vaultsData.usdc}
              internal={internalVaultsData.usdc}
            />
            <VaultItem
              mandatory={vaultsData.usdt}
              internal={internalVaultsData.usdt}
            />
            <VaultItem
              mandatory={vaultsData.usds}
              internal={internalVaultsData.usds}
            />
          </div>
        </div>

        {/* Chains Section */}
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Chains</h2>
        <div className="w-full mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueItem
            label='StatusL2 (Predeposit)'
            value={statusPredeposits.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
          <ValueItem
            label='Citrea (total / staked)'
            value={citreaTotalSupply.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' / ' + citreaStakedGusdSupply.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
          <ValueItem
            label='Ethereum'
            value={(unitTotalSupply - (statusPredeposits + citreaTotalSupply)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
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

        {/* Deposits Per Transaction Table Section */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Deposits Per Transaction</h2>
            {depositsPerTx.executionEndedAt && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last Dune query updated: {new Date(depositsPerTx.executionEndedAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      <div className="flex items-center justify-end gap-2">
                        <Image
                          src={CONTRACTS.ethereum.assets.usdc.metadata.iconSrc}
                          alt="USDC"
                          width={20}
                          height={20}
                        />
                        <span>USDC</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      <div className="flex items-center justify-end gap-2">
                        <Image
                          src={CONTRACTS.ethereum.assets.usdt.metadata.iconSrc}
                          alt="USDT"
                          width={20}
                          height={20}
                        />
                        <span>USDT</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      <div className="flex items-center justify-end gap-2">
                        <Image
                          src={CONTRACTS.ethereum.assets.usds.metadata.iconSrc}
                          alt="USDS"
                          width={20}
                          height={20}
                        />
                        <span>USDS</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Tenderly
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {depositsPerTx.data.map((entry, index) => (
                    <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                        {entry.time}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        entry.usdc < 0 ? 'text-red-600 dark:text-red-400' :
                        entry.usdc > 0 ? 'text-green-600 dark:text-green-400' :
                        'text-zinc-900 dark:text-zinc-100'
                      }`}>
                        {entry.usdc.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        entry.usdt < 0 ? 'text-red-600 dark:text-red-400' :
                        entry.usdt > 0 ? 'text-green-600 dark:text-green-400' :
                        'text-zinc-900 dark:text-zinc-100'
                      }`}>
                        {entry.usdt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        entry.usds < 0 ? 'text-red-600 dark:text-red-400' :
                        entry.usds > 0 ? 'text-green-600 dark:text-green-400' :
                        'text-zinc-900 dark:text-zinc-100'
                      }`}>
                        {entry.usds.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <a
                          href={`https://dashboard.tenderly.co/tx/${entry.tx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          title="View in Tenderly Dashboard"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full mt-auto pt-8 pb-4 flex items-center justify-center border-t border-zinc-200 dark:border-zinc-800">
          <Image
            src="/img/generic-logo-black.png"
            alt="Generic Protocol Logo"
            width={160}
            height={80}
            priority
            className="block dark:hidden"
          />
          <Image
            src="/img/generic-logo-white.png"
            alt="Generic Protocol Logo"
            width={160}
            height={80}
            priority
            className="hidden dark:block"
          />
        </footer>
      </main>
    </div>
  );
}
