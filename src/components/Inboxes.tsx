import React from "react"

import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery } from "react-query"

import useInboxes from "@hooks/useInboxes"
import { getInboxes, getSenders } from "@utils/contract"

import { Address } from "./Address"

export function Inboxes() {
  const { data: inboxes } = useQuery("inboxes", getInboxes)

  if (!inboxes) return null

  return (
    <div>
      {inboxes.map((inbox) => (
        <div key={inbox} className="space-y-2">
          <h2 className="text-xs uppercase text-[#8A857B]">{inbox}</h2>
          <Senders inbox={inbox} />
        </div>
      ))}
    </div>
  )
}

function Senders({ inbox }: { inbox: string }) {
  const { data: senders } = useQuery(["senders", inbox], () =>
    getSenders(inbox)
  )

  const { query } = useRouter()

  const activeSender = query.address?.toString()
  const activeInbox = query.inbox?.toString()

  const inboxes = useInboxes()

  if (!senders) return null

  return (
    <ul className="space-y-1">
      {senders.map((sender) => (
        <li key={sender} className="-mx-4">
          <Link href={`/${inbox}/${sender}`}>
            <a
              className={classNames(
                `flex items-center w-full pl-4 font-semibold text-left rounded-lg pr-1.5 py-1.5 space-x-2 hover:bg-[#E8E3D7] hover:bg-opacity-50`,
                inbox === activeInbox &&
                  sender === activeSender &&
                  `bg-[#E8E3D7]`
              )}
            >
              <Address account={sender} />

              {JSON.stringify(inboxes)}
              {/* {!!unread && (
              <span className="flex items-center justify-center w-6 h-6 text-sm text-white bg-green-500 rounded">
                {unread}
              </span>
            )} */}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  )
}
