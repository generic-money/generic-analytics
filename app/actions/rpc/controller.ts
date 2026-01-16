'use server'

import { client } from './client'
import { controllerAbi } from '@/public/abi/Controller.abi'
import { CONTRACTS } from '@/config/constants'
import { VaultContract } from '@/app/types/vaults'

export async function fetchVaultSettings(vault: VaultContract) {
    return client.readContract({
      address: CONTRACTS.controller.address,
      abi: controllerAbi,
      functionName: 'vaultSettings',
      args: [vault.address],
    }).then(res => ({
      maxCapacity: Number(res[0]) / 10 ** CONTRACTS.assets.unit.decimals,
      minProportionality: res[1] / 100,
      maxProportionality: res[2] / 100,
    }))
}
