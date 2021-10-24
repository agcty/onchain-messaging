import { ethers } from "ethers"
import { request, gql } from "graphql-request"
import { useQuery } from "react-query"

const endpoint = "https://api.studio.thegraph.com/query/12358/tolktest/0.0.3"

const provider = ethers.getDefaultProvider()

function useInboxes(owner: string) {
  return useQuery(["inboxes", owner], async () => {
    const address = await provider.resolveName(owner)
    const test = await request(
      endpoint,
      gql`
        query {
          inboxAddeds(where: { owner: "${address}" }) {
            id
            owner
            name
            description
          }
        }
      `
    )
    return test
  })
}

export default useInboxes
