import { encrypt } from "@metamask/eth-sig-util"
import { ethers } from "ethers"

import { MessageParams } from "@types"

import abi from "../abi"

const CONTRACT_ADDRESS = "0x12D7e04019EAEf6Fac940D3F600391E0adc9d66d"

async function send(to: string, message: string, inbox: string = "default") {
  const provider = window["ethereum"]

  if (!provider) {
    throw Error("Not connected!")
  }

  const ethersProvider = new ethers.providers.Web3Provider(provider)

  const pubKey = await getPublicKey(to)

  console.log("public key", pubKey)

  let finalMessage = message
  let encrypted = false

  if (pubKey) {
    encrypted = true
    finalMessage = ethers.utils.hexlify(
      Buffer.from(
        JSON.stringify(
          encrypt({
            publicKey: pubKey,
            data: message,
            version: "x25519-xsalsa20-poly1305",
          })
        ),
        "utf8"
      )
    )

    console.log("encrypted message", finalMessage)
  }

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    ethersProvider.getSigner()
  )

  const tx = await contract.send(to, finalMessage, inbox, encrypted)
  await tx.wait()
}

export async function getPublicKey(address: string) {
  const provider = window["ethereum"]

  if (!provider) {
    throw Error("Not connected!")
  }

  const ethersProvider = new ethers.providers.Web3Provider(provider)

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    ethersProvider.getSigner()
  )

  return contract.publicKeys(address)
}

interface Message {
  sender: string
  receiver: string
  messageId: number
  content: string
  encrypted: boolean
}

async function getMessage(messageParams: MessageParams) {
  const provider = window["ethereum"]

  if (!provider) {
    throw Error("Not connected!")
  }

  const ethersProvider = new ethers.providers.Web3Provider(provider)

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    ethersProvider.getSigner()
  )

  const message = await contract.messages(
    messageParams.receiver,
    messageParams.sender,
    messageParams.messageId
  )

  const formattedMessage: Message = {
    sender: message.sender,
    receiver: message.receiver,
    messageId: messageParams.messageId,
    content: message.content,
    encrypted: message.encrypted,
  }

  return { message: formattedMessage }
}

export interface CreateInboxParams {
  name: string
  description: string
  condition: {
    nftContract: string
    count: number
  }
}

async function createInbox(createInboxParams: CreateInboxParams) {
  const { name, description, condition } = createInboxParams

  const provider = window["ethereum"]

  if (!provider) {
    throw Error("Not connected!")
  }

  const ethersProvider = new ethers.providers.Web3Provider(provider)

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    ethersProvider.getSigner()
  )

  console.log(name, description, condition)

  const createInboxTx = await contract.addInbox(name, description, condition)
  await createInboxTx.wait()
}

async function addPublicKey(publicKey: string) {
  const provider = window["ethereum"]

  if (!provider) {
    throw Error("Not connected!")
  }

  const ethersProvider = new ethers.providers.Web3Provider(provider)

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    ethersProvider.getSigner()
  )

  const createInboxTx = await contract.addPublicKey(publicKey)
  await createInboxTx.wait()
}

async function getSenders(inbox: string) {
  // @Todo implement me

  return [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0xFd37f4625CA5816157D55a5b3F7Dd8DD5F8a0C2F",
  ]
}

async function getInboxes() {
  // @Todo implement me

  return ["default"]
}

export { send, getMessage, getSenders, getInboxes, createInbox, addPublicKey }
