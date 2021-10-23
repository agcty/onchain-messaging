import React from "react"

import { ArrowSmRightIcon } from "@heroicons/react/solid"

import { send } from "@utils/contract"

export function SendForm() {
  return (
    <form>
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
            "Hallo Bruder!"
          )
        }}
      >
        <ArrowSmRightIcon className="w-8 h-8" />
      </button>
    </form>
  )
}
