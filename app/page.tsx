import { fetchUnitsInTime, fetchDepositsInTime } from './actions/dune'
import { fetchUnitTotalSupply, fetchUSDCVaultTotalAssets, fetchUSDTVaultTotalAssets, fetchUSDSVaultTotalAssets, fetchUSDCPrice, fetchUSDTPrice, fetchUSDSPrice } from './actions/chain'

import ChangeInTimeBar from './components/ChangeInTimeBar'
import UnitsInTimeLine from './components/UnitsInTimeLine'
import VaultBalancesSection from './components/VaultBalancesSection'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [unitTotalSupply, usdcTotalAssets, usdtTotalAssets, usdsTotalAssets, usdcPrice, usdtPrice, usdsPrice] = await Promise.all([
    fetchUnitTotalSupply(),
    fetchUSDCVaultTotalAssets(),
    fetchUSDTVaultTotalAssets(),
    fetchUSDSVaultTotalAssets(),
    fetchUSDCPrice(),
    fetchUSDTPrice(),
    fetchUSDSPrice(),
  ]);

  const { unitsInTime, unitsExecutionEndedAt } = await fetchUnitsInTime();
  const unitsInTimeData = [
    {
      id: 'Unit Tokens',
      color: '#8b5cf6', // Purple color for units
      data: unitsInTime
    }
  ];

  const { depositsInTime, depositsExecutionEndedAt } = await fetchDepositsInTime();

  const totalVaultValue = usdcTotalAssets * usdcPrice + usdtTotalAssets * usdtPrice + usdsTotalAssets * usdsPrice;
  const overcollateralization = (totalVaultValue * 100 / unitTotalSupply);

  const colors = {
    usdc: '#2775CA',  // USDC blue (Circle's brand color)
    usdt: '#26A17B',  // USDT green (Tether's brand color)
    usds: '#6E62E5',  // USDS purple (Sky/MakerDAO inspired)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-12 px-6 bg-white dark:bg-black sm:items-start">
        <div className="w-full mb-12">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Analytics Dashboard</h1>
        </div>

        {/* Total Unit Tokens Section */}
        <div className="w-full mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-lg">
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
        <VaultBalancesSection
          initialData={{
            usdcTotalAssets,
            usdtTotalAssets,
            usdsTotalAssets,
            usdcPrice,
            usdtPrice,
            usdsPrice,
          }}
          colors={colors}
        />

        {/* Units In Time Chart Section */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Unit Tokens</h2>
            {unitsExecutionEndedAt && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last Dune query updated: {new Date(unitsExecutionEndedAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div style={{ height: '400px', width: '100%' }}>
              <UnitsInTimeLine data={unitsInTimeData} />
            </div>
          </div>
        </div>

        {/* Historical Chart Section */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Daily deposits</h2>
            {depositsExecutionEndedAt && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last Dune query updated: {new Date(depositsExecutionEndedAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div style={{ height: '400px', width: '100%' }}>
              <ChangeInTimeBar
                data={depositsInTime}
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
