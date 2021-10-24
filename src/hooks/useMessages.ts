import { request, gql } from "graphql-request"
import { useQuery } from "react-query"

import { useMetamask } from "./useMetamask"

const endpoint = "https://api.studio.thegraph.com/query/12358/tolktest/0.0.2"

export function useMessages(inbox: string, sender: string) {
  const { accounts } = useMetamask()
  return useQuery(
    ["messages", inbox, sender],
    async () => {
      return request(
        endpoint,
        gql`
        {
          sends(where: { inboxName: "${inbox}", receiver: "${accounts[0]}", sender: "${sender}" }) {
            id
            content
            encrypted
          }
        }
      `
      )
    },
    { enabled: !!accounts[0] && !!inbox && !!sender }
  )
}
