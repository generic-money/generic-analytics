export type PriceFeedKey = 'usdc' | 'usdt' | 'usds';

export interface PriceFeedContract {
  address: `0x${string}`;
  decimals: number;
}

export type PriceFeedsMap<T> = Record<PriceFeedKey, T>;
