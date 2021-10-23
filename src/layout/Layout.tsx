import React from "react"

import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"

const Profile = dynamic(
  () => import("@components/Profile").then((m) => m.Profile),
  { ssr: false }
)

const Inboxes = dynamic(
  () => import("@components/Inboxes").then((m) => m.Inboxes),
  { ssr: false }
)

export default function Layout({ children }: any) {
  return (
    <div>
      <Head>
        <title>Tolk</title>
      </Head>
      <div className="flex w-full h-screen divide-x">
        <div className="w-full max-w-xs p-20 pr-6 space-y-6">
          <Profile />

          <div className="space-y-2">
            <Link href="/send">
              <a className="block p-2 bg-green-400 rounded-lg">
                Send a message
              </a>
            </Link>
            <Link href="/create">
              <a className="block p-2 text-white bg-gray-900 rounded-lg">
                Create an inbox
              </a>
            </Link>
          </div>

          <Inboxes />
        </div>
        <div className="flex-1 h-full px-24 pt-20">{children}</div>
      </div>
    </div>
  )
}
