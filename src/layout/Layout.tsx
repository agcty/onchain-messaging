import React from "react"

import { ArrowRightIcon } from "@heroicons/react/solid"
import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"

import { useMetamask } from "@hooks/useMetamask"
import { mint } from "@utils/contract"

const Profile = dynamic(
  () => import("@components/Profile").then((m) => m.Profile),
  { ssr: false }
)

const Inboxes = dynamic(
  () => import("@components/Inboxes").then((m) => m.Inboxes),
  { ssr: false }
)

export default function Layout({ children }: any) {
  const { accounts } = useMetamask()

  return (
    <div>
      <Head>
        <title>Tolk</title>
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="w-full px-10 rounded-xl bg-beige-500 max-w-7xl">
          <div className="flex w-full h-full divide-x">
            <div className="w-full max-w-sm px-6 py-24 pr-6 space-y-8">
              <Profile />

              <div className="space-y-2">
                <Link href="/send">
                  <a className="flex items-center justify-between px-4 font-semibold text-white bg-green-500 rounded-xl py-2.5 hover:opacity-70 transition gap-8">
                    <span>Send new message</span>
                    <ArrowRightIcon className="w-5 h-5 text-white"></ArrowRightIcon>
                  </a>
                </Link>

                <Link href="/create">
                  <a className="flex items-center justify-between px-4 font-semibold text-white bg-gray-900 rounded-xl py-2.5 hover:opacity-70 transition gap-8">
                    <span>Create an inbox</span>
                    <ArrowRightIcon className="w-5 h-5 text-white"></ArrowRightIcon>
                  </a>
                </Link>

                <Link href="/keys">
                  <a className="flex items-center justify-between px-4 font-semibold text-white bg-gray-500 rounded-xl py-2.5 hover:opacity-70 transition gap-8">
                    <span>Add Public Key</span>
                    <ArrowRightIcon className="w-5 h-5 text-white"></ArrowRightIcon>
                  </a>
                </Link>
              </div>

              <Inboxes />
            </div>
            <div className="flex-1 h-full px-20 py-24">{children}</div>
          </div>
        </div>

        <button
          className="mt-12 text-xs"
          onClick={async () => {
            await mint(accounts[0])
          }}
        >
          Mint test nft
        </button>
      </div>
    </div>
  )
}
