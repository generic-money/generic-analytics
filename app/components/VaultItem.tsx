'use client'

import { AssetMetadata } from '@/app/types/assets';

interface VaultItemProps {
  assetMetadata: AssetMetadata;
  totalAssets: number;
  price: number;
  vaultAddress: string;
  strategyAddress: string;
  internal?: VaultItemInternalProps;
}

export interface VaultItemInternalProps {
  allocated: number;
  available: number;
  mintSlippage: number;
  redeemSlippage: number;
  maxCapacity: number;
  minProportionality: number;
  maxProportionality: number;
  autodepositThreshold: number;
}

export default function VaultItem(props: VaultItemProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: props.assetMetadata.color + '20' }}>
          <img src={props.assetMetadata.iconSrc} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{props.assetMetadata.symbol}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{props.assetMetadata.name}</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Balance</span>
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {props.totalAssets.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Oracle Price</span>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            ${props.price.toFixed(4)}
          </span>
        </div>

        <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Value</span>
            <span className="text-xl font-bold" style={{ color: props.assetMetadata.color }}>
              ${(props.totalAssets * props.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Vault Address Section */}
        <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Vault Address</span>
            </div>
            <a
              href={`https://eth.blockscout.com/address/${props.vaultAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline"
            >
              {props.vaultAddress.slice(0, 6)}...{props.vaultAddress.slice(-4)}
            </a>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Strategy Address</span>
            </div>
            <a
              href={`https://eth.blockscout.com/address/${props.strategyAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline"
            >
              {props.strategyAddress.slice(0, 6)}...{props.strategyAddress.slice(-4)}
            </a>
          </div>
        </div>

        {props.internal && (
          <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            {/* Allocation */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">Allocation</div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Allocated</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {props.internal.allocated.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Available</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {props.internal.available.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Slippage */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">Slippage</div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Mint Slippage</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {props.internal.mintSlippage.toFixed(4)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Redeem Slippage</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {props.internal.redeemSlippage.toFixed(4)}%
                </span>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">Settings</div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Max Capacity</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {props.internal.maxCapacity.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Proportionality Range</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {props.internal.minProportionality.toFixed(0)}% - {props.internal.maxProportionality.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Autodeposit Threshold</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {props.internal.autodepositThreshold.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
