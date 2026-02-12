import { ValueContract } from './common';

export type AssetKey = 'unit' | 'gusd' | 'usdc' | 'usdt' | 'usds';

export interface AssetContract extends ValueContract {
  metadata: AssetMetadata;
}

export interface AssetMetadata {
  iconSrc: string;
  symbol: string;
  name: string;
  color: string;
}
