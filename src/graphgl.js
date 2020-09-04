import graphql from 'babel-plugin-relay/macro';


export const GET_PAGINATION_REPOSITORY_BY_SEARCH = graphql`
query graphglPaginationRepositoryNameQuery(
  $first: Int!,
  $after:String,
  $query:String!,
  $type: SearchType!) {

  search(first: $first, after:$after, query: $query, type: $type) {
    repositoryCount
    edges {
      node {
        ... on Repository {
          id
          name
          description
          forkCount
          url
          owner {
            avatarUrl
            url
            login
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`

export const GET_OWNER_BY_INFO = graphql`
query graphglOwnerInfoQuery($query: String!) {
  repositoryOwner(login: $query) {
    login
    ... on User {
      bio
      email
    }
  }
}
`

export const GET_REPOSITORY_BY_SEARCH = graphql`
query graphglRepositoryNameQuery($repository: String!) {
  search(first: 99, query: $repository, type: REPOSITORY) {
    repositoryCount
    pageInfo {
      endCursor
    }
    nodes {

      ... on Repository {
        nameWithOwner
        createdAt
        id
        url
        name
        owner {
          id
          url
          resourcePath
          # repositories(first:1) {
          #   edges {
          #     cursor
          #   }
          # }
        }
        stargazers {
          totalCount
        }
      }

    }
  }
}
`