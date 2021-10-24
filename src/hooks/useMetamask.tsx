import React, { createContext, useEffect, useReducer, useRef } from "react"

import MetaMaskOnboarding from "@metamask/onboarding"
import Cookies from "js-cookie"

import getChain from "@utils/chain"

type ApiState =
  | "IDLE"
  | "CONNECT_INIT"
  | "CONNECTING"
  | "ERROR"
  | "READY"
  | "SWITCHING_CHAINS"
  | "ONBOARDING"

interface State {
  accounts: string[]
  status: ApiState
  error: Error
}

type ContextValue = State & {
  connect: () => Promise<void>
  switchChains: () => Promise<void>
}

const INIT_STATE: ContextValue = {
  accounts: [],
  status: "ONBOARDING",
  error: null,
  connect: null,
  switchChains: null,
}

const Web3Context = createContext<ContextValue>(INIT_STATE)

type Action =
  | { type: "IDLE" }
  | { type: "CONNECT"; payload: string[] }
  | { type: "ONBOARDING" }
  | { type: "CONNECT_SUCCESS" }
  | { type: "CONNECT_ERROR"; payload: Error }
  | { type: "INCORRECT_NETWORK"; payload: Error }
  | { type: "SWITCHING_CHAINS" }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "IDLE":
      return { ...state, status: "IDLE" }

    case "CONNECT":
      return { ...state, status: "CONNECTING", accounts: action.payload }

    case "CONNECT_SUCCESS":
      return { ...state, status: "READY" }

    case "CONNECT_ERROR":
      return { ...state, status: "ERROR", error: action.payload }

    case "SWITCHING_CHAINS":
      return { ...state, status: "SWITCHING_CHAINS" }

    default:
      throw new Error(`Unknown type!`)
  }
}

function MetamaskContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INIT_STATE)

  const chain = getChain("rinkeby")

  const onboarding = useRef<MetaMaskOnboarding>()

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding()
    }
  }, [])

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      //based on https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
      if (state.accounts.length > 0) {
        dispatch({ type: "CONNECT_SUCCESS" })

        const consentGiven = Cookies.get("consent")

        onboarding.current.stopOnboarding()
      } else {
        dispatch({ type: "IDLE" })
      }
    }
  }, [state.accounts])

  useEffect(() => {
    const run = async () => {
      function handleNewAccounts(newAccounts: string[]) {
        dispatch({ type: "CONNECT", payload: newAccounts })
      }

      const consentGiven = Cookies.get("consent")

      // metmask is installed and window.ethereum is available
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        // set listener before checking for consent so it's actually set

        window["ethereum"].on("accountsChanged", handleNewAccounts)

        window["ethereum"].on("chainChanged", (chainId: string) => {
          if (chainId !== chain.chainId) {
            dispatch({
              type: "CONNECT_ERROR",
              payload: new Error("Incorrect Network"),
            })
          } else {
            dispatch({ type: "CONNECT_SUCCESS" })
          }
        })

        // check if consent is given to request accounts, this is to prevent requesting when opening the website
        if (consentGiven !== "true") {
          return
        } else {
          await switchChains()

          window["ethereum"]
            .request({ method: "eth_requestAccounts" })
            .then(handleNewAccounts)
        }

        return () => {
          window["ethereum"]?.off?.("accountsChanged", handleNewAccounts)
        }
      }
    }

    run()
  }, [])

  async function switchChains() {
    try {
      console.log("Switching chains")
      await window["ethereum"].request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chain.chainId }],
      })
    } catch (error) {
      if (error.code === 4902 || error.code === -32603) {
        try {
          await window["ethereum"].request({
            method: "wallet_addEthereumChain",
            params: [
              {
                ...chain,
              },
            ],
          })
        } catch (addError) {
          console.log("aborted")
        }
      }
    }
  }

  async function connect() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (
        state.status === "ERROR" &&
        state.error.message === "Incorrect Network"
      ) {
        await switchChains()
      }

      let newAccounts = await window["ethereum"].request({
        method: "eth_requestAccounts",
      })

      dispatch({ type: "CONNECT", payload: newAccounts })
      Cookies.set("consent", true)
    } else {
      onboarding.current.startOnboarding()
    }
  }

  return (
    <Web3Context.Provider value={{ ...state, connect, switchChains }}>
      {children}
    </Web3Context.Provider>
  )
}

function useMetamask() {
  return React.useContext(Web3Context)
}

export { MetamaskContextProvider, useMetamask }
