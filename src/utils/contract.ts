import { ethers } from "ethers"

import abi from "@abi"

async function send(to: string, message: string) {
  let contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

  const provider = window["ethereum"]

  if (!provider) {
    throw Error("Not connected!")
  }

  const ethersProvider = new ethers.providers.Web3Provider(provider)

  // @todo make multichain
  let etherscanProvider = new ethers.providers.EtherscanProvider()

  const history = await etherscanProvider.getHistory(to)

  const previousTx = history[0]

  if (!previousTx) {
    throw new Error("No previous transaction found")
  }

  const theTx = await ethersProvider.getTransaction(
    "0x9e1305489c8d9e6f0eba94fbae6c5402c2c7d719a0e370b3ca20a11fa3602968"
  )

  console.log("tx", theTx)

  const pubKey = await getPublicKey(theTx)

  console.log("pubkey", pubKey, ethers.utils.computeAddress(pubKey))

  // const encrypted = await EthCrypto.encryptWithPublicKey(
  //   "bf1cc3154424dc22191941d9f4f50b063a2b663a2337e5548abea633c1d06ece...", // publicKey
  //   message
  // )

  // const encryptedMessage = EthCrypto.cipher.stringify(encrypted)

  const contract = new ethers.Contract(
    contractAddress,
    abi,
    ethersProvider.getSigner()
  )

  const tx = await contract.send(to, "hello world", false)
  await tx.wait()
}

export { send }

async function getPublicKey(tx: any) {
  const expandedSig = {
    r: tx.r,
    s: tx.s,
    v: tx.v,
  }
  const signature = ethers.utils.joinSignature(expandedSig)
  const txData = {
    gasPrice: tx.gasPrice,
    gasLimit: tx.gasLimit,
    value: tx.value,
    nonce: tx.nonce,
    data: tx.data,
    chainId: tx.chainId,
    to: tx.to, // you might need to include this if it's a regular tx and not simply a contract deployment
  }
  const rsTx = await ethers.utils.resolveProperties(txData)
  const raw = ethers.utils.serializeTransaction(rsTx) // returns RLP encoded tx
  const msgHash = ethers.utils.keccak256(raw) // as specified by ECDSA
  const msgBytes = ethers.utils.arrayify(msgHash) // create binary hash

  return ethers.utils.recoverPublicKey(msgBytes, signature)
}
