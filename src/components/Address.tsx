import makeBlockie from "ethereum-blockies-base64"
import { ethers } from "ethers"
import { useQuery } from "react-query"

import { formatAddress } from "@utils/formatter"

export function Address({ account }: any) {
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
      try {
        const provider = ethers.getDefaultProvider()
        return provider.getAvatar(account)
      } finally {
        return makeBlockie(account)
      }
    },
    { enabled: !!account }
  )

  if (!account) return null

  return (
    <span className="relative items-center inline-block pl-6 space-x-1">
      <img
        src={avatar}
        className="absolute left-0 w-6 h-6 rounded top-1/2 transform -translate-y-1/2"
        alt=""
      />

      <span>{name ?? formatAddress(account)}</span>
    </span>
  )
}
