import React, { useState } from "react"

import classNames from "classnames"
import { useRouter } from "next/dist/client/router"
import dynamic from "next/dynamic"
import toast from "react-hot-toast"
import { useInfiniteQuery } from "react-query"

import { useMetamask } from "@hooks/useMetamask"
import Layout from "@layout/Layout"
import { getMessage } from "@utils/contract"

const Address = dynamic<any>(
  () => import("@components/Address").then((m) => m.Address),
  { ssr: false }
)

export default function Chat() {
  const { query } = useRouter()

  const address = query.address?.toString()
  const inbox = query.inbox?.toString()

  const { accounts } = useMetamask()

  const { data, fetchNextPage } = useInfiniteQuery(
    ["/fetchMessages", inbox, accounts[0], address],
    ({ pageParam = 0 }) =>
      getMessage({
        receiver: accounts[0],
        sender: address,
        messageId: pageParam,
      }),
    {
      getNextPageParam: (lastPage, pages) => lastPage.message.messageId + 1,
    }
  )

  return (
    <Layout>
      <div className="flex flex-col w-auto h-full mx-auto">
        <h1 className="mb-4 text-xl font-bold">
          Messages from <Address account={address} />
        </h1>

        <div className="flex flex-col w-full h-full px-8 py-4 mx-auto bg-white min-h-[400px] rounded-32 divide-y space-y-4 min-w-[800px]">
          <div className="flex-1 overflow-auto space-y-8 max-w-prose">
            &nbsp;
            {data?.pages?.map((item) => {
              return (
                <Message
                  key={item.message.messageId}
                  message={item.message.content}
                  encrypted={item.message.encrypted}
                />
              )
            })}
          </div>

          <button
            className="block px-3 py-2 mx-auto text-sm text-white bg-green-500 rounded-xl"
            onClick={async () => {
              try {
                await fetchNextPage()
              } catch (error) {
                toast.error("No more messages to fetch!")
              }
            }}
          >
            Load more messages
          </button>
        </div>
      </div>
    </Layout>
  )
}

function Message({ message, outgoing, encrypted }: any) {
  const [decryptedMessage, setDecryptedMessage] = useState(message)
  const [decrypted, setDecrypted] = useState(!encrypted)
  const { accounts } = useMetamask()

  return (
    <div
      className={classNames(
        `relative p-2 pb-6 rounded-[12px] max-w-[60%] break-all`,
        outgoing && `bg-[#F4EFE7] ml-auto`,
        !outgoing && `bg-[#F5F5F5]`,
        !decrypted && `cursor-pointer`
      )}
      onClick={async () => {
        if (decrypted) return

        const message = await window["ethereum"].request({
          method: "eth_decrypt",
          params: [decryptedMessage, accounts[0]],
        })

        setDecryptedMessage(message)
        setDecrypted(true)
      }}
    >
      <div className={!decrypted ? `blur-lg` : ""}>{decryptedMessage}</div>
      {!decrypted && (
        <button className="absolute p-2 bg-white rounded-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Decrypt
        </button>
      )}
    </div>
  )
}
