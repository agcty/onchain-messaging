import React from "react"

import makeBlockie from "ethereum-blockies-base64"
import { ethers } from "ethers"
import { useQuery } from "react-query"

import { useMetamask } from "@hooks/useMetamask"
import { formatAddress } from "@utils/formatter"

import { ConnectButton } from "./ConnectButton"

export function Profile() {
  const { accounts } = useMetamask()
  const account = accounts?.[0]
  const provider = new ethers.providers.Web3Provider(window?.["ethereum"])

  const { data: name } = useQuery(
    ["ens", account],
    async () => {
      const provider = ethers.getDefaultProvider()
      return provider.lookupAddress(account)
    },
    { enabled: !!account }
  )

  const { data: avatar } = useQuery(
    ["avatar", account],
    async () => {
      const avatar = await provider.getAvatar(account)
      if (!avatar) return makeBlockie(account)
      return avatar
    },
    { enabled: !!account }
  )

  const hasENSName = !!name

  return account ? (
    <div className="space-y-2">
      <img src={avatar} className="w-8 h-8 rounded" alt="" />
      {hasENSName ? (
        <div>
          <h1 className="text-xl font-bold">{name}</h1>
          <p className="text-sm text-gray-500" title={account}>
            {formatAddress(account)}
          </p>
        </div>
      ) : (
        <h1 className="text-xl font-bold">{formatAddress(account)}</h1>
      )}
    </div>
  ) : (
    <ConnectButton />
  )
}
