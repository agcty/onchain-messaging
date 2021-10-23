import React from "react"

import { ArrowSmRightIcon } from "@heroicons/react/solid"
import classNames from "classnames"
import dynamic from "next/dynamic"
import Head from "next/head"

import { send } from "@utils/contract"

const Profile = dynamic(
  () => import("@components/Profile").then((m) => m.Profile),
  { ssr: false }
)

export default function Home() {
  return (
    <div>
      <Head>
        <title>Tolk</title>
      </Head>
      <div className="flex w-full h-screen divide-x">
        <div className="w-full max-w-xs p-20 pr-6 space-y-6">
          <Profile />

          <div className="space-y-2">
            <h2 className="text-xs uppercase text-[#8A857B]">Last 24 hours</h2>
            <ul>
              <li className="-mx-4">
                <User
                  name="rick.eth"
                  icon="https://via.placeholder.com/24x24"
                  unread={1}
                />
              </li>
              <li className="-mx-4">
                <User
                  name="rick.eth"
                  icon="https://via.placeholder.com/24x24"
                />
              </li>
              <li className="-mx-4">
                <User
                  name="rick.eth"
                  icon="https://via.placeholder.com/24x24"
                  unread={10}
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1 h-full px-24 pt-20">
          <div className="flex flex-col w-auto h-full mx-auto max-w-prose">
            <h1 className="mb-4 text-xl font-bold">
              Chatting with{" "}
              <span className="relative items-center inline-block pl-6 space-x-1">
                <img
                  className="absolute left-0 top-1/2 transform -translate-y-1/2"
                  src="https://via.placeholder.com/24x24"
                  alt=""
                />
                <span>rick.eth</span>
              </span>
            </h1>
            <div className="flex flex-col h-full mx-auto overflow-auto bg-white rounded-t-3xl divide-y max-w-prose">
              <div className="flex-1 px-8 py-4 space-y-8">
                <Message>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo,
                  voluptatem! Rem, autem soluta nihil mollitia voluptates earum
                  fugit voluptatibus ut officia iure est veniam eius, maxime
                  eveniet aliquid rerum ratione!
                </Message>
                <Message outgoing>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo,
                  voluptatem! Rem, autem soluta nihil mollitia voluptates earum
                  fugit voluptatibus ut officia iure est veniam eius, maxime
                  eveniet aliquid rerum ratione!
                </Message>
                <Message outgoing>Lorem ipsum dolor</Message>
              </div>
              <div className="flex">
                <input
                  className="flex-1 px-8 py-4 border-none"
                  type="text"
                  placeholder="Enter your message…"
                />
                <button
                  className="px-8 py-4"
                  title="Send message"
                  onClick={async () => {
                    await send(
                      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                      "Hallo Bruder!",
                      false
                    )
                  }}
                >
                  <ArrowSmRightIcon className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

function User({ name, icon, unread }: any) {
  return (
    <button className="flex items-center w-full pl-4 font-semibold text-left rounded-lg pr-1.5 py-1.5 space-x-2 hover:bg-[#E8E3D7]">
      <img src={icon} className="rounded-full" alt="" />
      <span className="flex-1 w-full">{name}</span>
      {!!unread && (
        <span className="flex items-center justify-center w-6 h-6 text-sm text-white bg-green-500 rounded">
          {unread}
        </span>
      )}
    </button>
  )
}
