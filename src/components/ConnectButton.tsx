import classNames from "classnames"

import { useMetamask } from "@hooks/useMetamask"

export function ConnectButton() {
  const { connect, status, switchChains, accounts, error } = useMetamask()

  if (status === "ERROR" && error.message === "Incorrect Network") {
    return (
      <button
        className="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-green-400 border animate-pulse shadow-sm hover:bg-accent focus:outline-none transition border-accent"
        onClick={async () => {
          await switchChains()
        }}
      >
        Incorrect Chain
      </button>
    )
  }

  return (
    <button
      onClick={async () => {
        await connect()
      }}
      type="button"
      className={classNames(
        "relative inline-flex items-center px-4 py-2 font-medium bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-400 focus:outline-none transition border-accent",
        {
          "border-accent": status === "READY",
          "border-accent bg-accent hover:bg-transparent": status === "IDLE",
        }
      )}
    >
      {status === "READY" && accounts[0]}
      {status === "IDLE" && "Connect wallet"}
      {status === "ONBOARDING" && "Install MetaMask"}
    </button>
  )
}
