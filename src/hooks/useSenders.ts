import { request, gql } from "graphql-request"
import { useQuery } from "react-query"

import { useMetamask } from "./useMetamask"

const endpoint = "https://api.studio.thegraph.com/query/12358/tolktest/0.0.2"

export function useSenders(inbox: string) {
  const { accounts } = useMetamask()
  return useQuery(
    ["senders", inbox],
    async () => {
      const { sends } = await request(
        endpoint,
        gql`
        {
          sends(where: { inboxName: "${inbox}", receiver: "${accounts[0]}" }) {
            id
            sender
          }
        }
      `
      )

      return sends.reduce((agg, send) => agg.add(send.sender), new Set())
    },
    { enabled: !!accounts[0] && !!inbox }
  )
}
