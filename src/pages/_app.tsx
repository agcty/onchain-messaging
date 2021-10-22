import React from "react"

import { AppProps } from "next/app"
import { Toaster } from "react-hot-toast"

import { MetamaskContextProvider } from "@hooks/useMetamask"
import { ModalProvider } from "@hooks/useModal"

import "../styles/tailwind.scss"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ModalProvider>
      <MetamaskContextProvider>
        <Component {...pageProps} />
      </MetamaskContextProvider>
      <Toaster />
    </ModalProvider>
  )
}

export default MyApp
