import axios from 'axios'

const axiosGitHubGraphQL = axios.create({
   baseURL: 'https://api.github.com/graphql',
   headers: {
         Authorization: `bearer ${
         process.env.REACT_APP_GITHUB_AUTH_TOKEN
      }`,
   },
})

function getRepositoryBySearch(text, variables = 'the-road-to-learn-react', isMutation, isQuery, cache) {

   return axiosGitHubGraphQL
      .post('', { query: text, variables }).then(queryResult => {
         // if (isQuery && queryResult.data) { cache.set(text, variables, queryResult.data) } // cache
         // if (isMutation) { cache.clear() }
         return queryResult.data 
      })

}

export default getRepositoryBySearch