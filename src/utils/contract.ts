import { ethers } from "ethers"

import abi from "../abi"

async function send(to: string, message: string) {
  let contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

  const provider = window["ethereum"]

  if (!provider) {
    throw Error("Not connected!")
  }

  const ethersProvider = new ethers.providers.Web3Provider(provider)

  const contract = new ethers.Contract(
    contractAddress,
    abi,
    ethersProvider.getSigner()
  )

  const tx = await contract.send(to, message, false)
  await tx.wait()
}

export { send }
