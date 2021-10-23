import EthCrypto from "eth-crypto"
import { ethers } from "ethers"

import { MessageParams } from "@types"

import abi from "../abi"

async function send(to: string, message: string) {
  let contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

  const provider = window["ethereum"]

  if (!provider) {
    throw Error("Not connected!")
  }

  const ethersProvider = new ethers.providers.Web3Provider(provider, "rinkeby")

  // @todo make multichain
  let etherscanProvider = new ethers.providers.EtherscanProvider("rinkeby")

  const history = await etherscanProvider.getHistory(to)

  const previousTx = history[0]

  if (!previousTx) {
    throw new Error("No previous transaction found")
  }

  console.log("Previous transaction", previousTx)

  // @todo get tx from current chain
  const theTx = await ethersProvider.getTransaction(previousTx.hash)

  if (!theTx) {
    throw new Error("Could not fetch previous transaction")
  }

  console.log("Raw transaction", theTx)

  const pubKey = await getPublicKey(theTx)

  const encrypted = await EthCrypto.encryptWithPublicKey(
    pubKey.slice(2),
    message
  )

  const encryptedMessage = EthCrypto.cipher.stringify(encrypted)

  const contract = new ethers.Contract(
    contractAddress,
    abi,
    ethersProvider.getSigner()
  )

  const tx = await contract.send(to, encryptedMessage, "default")
  await tx.wait()
}

// See https://gist.github.com/chrsengel/2b29809b8f7281b8f10bbe041c1b5e00
async function getPublicKey(tx: any) {
  const expandedSig = {
    r: tx.r,
    s: tx.s,
    v: tx.v,
  }
  const signature = ethers.utils.joinSignature(expandedSig)
  const rsTx = await ethers.utils.resolveProperties(tx)
  const raw = ethers.utils.serializeTransaction(rsTx) // returns RLP encoded tx
  const msgHash = ethers.utils.keccak256(raw) // as specified by ECDSA
  const msgBytes = ethers.utils.arrayify(msgHash) // create binary hash
  const recoveredPubKey = ethers.utils.recoverPublicKey(msgBytes, signature)

  return recoveredPubKey
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
  }

  return { message: formattedMessage }
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

  return ["public"]
}

export { send, getMessage, getSenders, getInboxes }
