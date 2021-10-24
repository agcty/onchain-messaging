import React from "react"

import splitbee from "@splitbee/web"
import { AppProps } from "next/app"
import { Toaster } from "react-hot-toast"
import { QueryClient, QueryClientProvider } from "react-query"

import { MetamaskContextProvider } from "@hooks/useMetamask"
import { ModalProvider } from "@hooks/useModal"

import "../styles/tailwind.scss"

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  splitbee.init()

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
