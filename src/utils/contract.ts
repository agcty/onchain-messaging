import { ethers } from "ethers"

import abi from "../abi"

async function send(to: string, message: string, encrypted: boolean) {
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

  const tx = await contract.send(to, message, encrypted)
  await tx.wait()
}

async function getMessage(
  receiver: string,
  from: string,
  messageIndex: number
) {
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

  const tx = await contract.inboxes(receiver, from, messageIndex)

  return tx
}

export { send, getMessage }
