import React from "react"

import dynamic from "next/dynamic"
import Head from "next/head"

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

          <Inboxes />
        </div>
        <div className="flex-1 h-full px-24 pt-20">{children}</div>
      </div>
    </div>
  )
}
