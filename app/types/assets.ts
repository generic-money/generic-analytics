export type AssetKey = 'unit' | 'usdc' | 'usdt' | 'usds';

export interface AssetContract {
  address: `0x${string}`;
  decimals: number;
}

export type AssetsMap<T> = Record<AssetKey, T>;
