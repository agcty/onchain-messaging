import { request, gql } from "graphql-request"
import { useQuery } from "react-query"

const endpoint = "https://api.studio.thegraph.com/query/12358/tolktest/0.0.2"

function useInboxes() {
  return useQuery("posts", async () => {
    const test = await request(
      endpoint,
      gql`
        query {
          inboxAddeds(first: 5) {
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
