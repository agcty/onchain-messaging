import React from "react"

import classNames from "classnames"
import { useRouter } from "next/dist/client/router"
import dynamic from "next/dynamic"
import toast from "react-hot-toast"
import { useInfiniteQuery } from "react-query"

import { SendForm } from "@components/SendForm"
import { useMetamask } from "@hooks/useMetamask"
import Layout from "@layout/Layout"
import { MessageParams } from "@types"
import { getMessage } from "@utils/contract"

const Address = dynamic(
  () => import("@components/Address").then((m) => m.Address),
  { ssr: false }
)

export default function Chat() {
  const { query } = useRouter()

  const address = query.address?.toString()
  const inbox = query.inbox?.toString()

  const { accounts } = useMetamask()

  const initialMessageParams: MessageParams = {
    receiver: accounts[0],
    sender: address,
    messageId: 0,
  }

  const { data, fetchNextPage } = useInfiniteQuery(
    ["/fetchMessages", inbox, accounts[0], address],
    ({ pageParam = 0 }) =>
      getMessage({ ...initialMessageParams, messageId: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => lastPage.message.messageId + 1,
      keepPreviousData: true,
    }
  )

  return (
    <Layout>
      <div className="flex flex-col w-auto h-full mx-auto max-w-prose">
        <h1 className="mb-4 text-xl font-bold">
          Chatting with <Address account={address} />
        </h1>
        <div className="flex flex-col w-full h-full mx-auto overflow-auto bg-white rounded-t-3xl divide-y max-w-prose space-y-4">
          <div className="flex-1 px-8 py-4 space-y-8">
            {data?.pages?.map((item) => (
              <Message key={item.message.messageId}>
                {item.message.content}
              </Message>
            ))}
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
          <SendForm />
        </div>
      </div>
    </Layout>
  )
}

function Message({ children, outgoing }: any) {
  return (
    <div
      className={classNames(
        `p-2 pb-6 rounded-[12px] max-w-[60%]`,
        outgoing && `bg-[#F4EFE7] ml-auto`,
        !outgoing && `bg-[#F5F5F5]`
      )}
    >
      {children}
    </div>
  )
}
