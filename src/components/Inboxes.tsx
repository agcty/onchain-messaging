import React from "react"

import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"

import useInboxes from "@hooks/useInboxes"
import { useMetamask } from "@hooks/useMetamask"
import { useSenders } from "@hooks/useSenders"

import { Address } from "./Address"

export function Inboxes() {
  const { accounts } = useMetamask()
  const { data } = useInboxes(accounts[0])

  if (!data?.inboxAddeds) return null

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h2 className="text-xs uppercase text-[#8A857B]">Default Inbox</h2>
        <Senders inbox="default" />
      </div>
      {data?.inboxAddeds.map((inbox) => (
        <div key={inbox.id} className="space-y-2">
          <h2 className="text-xs uppercase text-[#8A857B]">{inbox.name}</h2>
          <Senders inbox={inbox.name} />
        </div>
      ))}
    </div>
  )
}

function Senders({ inbox }: { inbox: string }) {
  const { query } = useRouter()

  const activeSender = query.address?.toString()
  const activeInbox = query.inbox?.toString()

  const { data: senders } = useSenders(inbox)

  if (!senders) return <p className="text-sm ">No messages yet</p>

  return (
    <ul className="space-y-1">
      {senders.length ? (
        senders.map((sender) => (
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
              </a>
            </Link>
          </li>
        ))
      ) : (
        <p className="text-sm ">No messages yet</p>
      )}
    </ul>
  )
}
