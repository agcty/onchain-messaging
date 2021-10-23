import React from "react"

import { AppProps } from "next/app"
import { Toaster } from "react-hot-toast"
import { QueryClient, QueryClientProvider } from "react-query"

import { MetamaskContextProvider } from "@hooks/useMetamask"
import { ModalProvider } from "@hooks/useModal"

import "../styles/tailwind.scss"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <MetamaskContextProvider>
          <Component {...pageProps} />
        </MetamaskContextProvider>
        <Toaster />
      </ModalProvider>
    </QueryClientProvider>
  )
}

export default MyApp
