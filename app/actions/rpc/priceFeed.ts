'use server'

import { client } from './client'
import { chainlinkFeedAbi } from '@/public/abi/ChainlinkFeed.abi'
import { PriceFeedContract } from '@/app/types/priceFeeds'

export async function fetchPrice(priceFeed: PriceFeedContract) {
  return client.readContract({
    address: priceFeed.address,
    abi: chainlinkFeedAbi,
    functionName: 'latestRoundData',
  }).then(res => Number(res[1]) / 10 ** priceFeed.decimals)
}
