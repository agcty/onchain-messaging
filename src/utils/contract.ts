import { ethers } from "ethers"

import { MessageParams } from "@types"

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

interface Message {
  sender: string
  receiver: string
  messageId: number
  content: string
}

async function getMessage(messageParams: MessageParams) {
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

  const message = await contract.inboxes(
    messageParams.receiver,
    messageParams.sender,
    messageParams.messageId
  )

  const formattedMessage: Message = {
    sender: message.sender,
    receiver: message.receiver,
    messageId: messageParams.messageId,
    content: message.content,
  }

  return { message: formattedMessage }
}

export { send, getMessage }
