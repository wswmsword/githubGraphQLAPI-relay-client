import React, { Suspense, useState, useEffect } from 'react';
import { Button, Spin } from 'antd'
import './App.css';
import { GET_REPOSITORY_BY_SEARCH, GET_PAGINATION_REPOSITORY_BY_SEARCH, GET_OWNER_BY_INFO } from './graphgl'
import Form from './components/Form'
import Repository from './components/Repository'

import RelayEnvironment from './RelayEnvironment';
import {
  RelayEnvironmentProvider,
  preloadQuery,
  usePreloadedQuery,
} from 'react-relay/hooks';
import {fetchQuery} from 'relay-runtime';

const TITLE = 'React GraphQL GitHub Relay Client'
export const AppContext = React.createContext({})

function AppRoot()
{
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={'Loading...'}>
        <App preloadedQuery={preloadedQuery} />
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

function App(props)
{
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('') // 上一次搜索的仓库名称
  const preloadedData = usePreloadedQuery(GET_PAGINATION_REPOSITORY_BY_SEARCH, props.preloadedQuery)
  return (
    <AppContext.Provider value={{preloadedData, data, setData, loading, setLoading, query, setQuery}}>
      <div className="App">
        <h1>{TITLE}</h1>
        <Form loadQuery={loadQuery} loadPaginationQuery={loadPaginationQuery}></Form>
        <hr />
        <Spin spinning={loading}><Repository loadOwnerInfoQuery={loadOwnerInfoQuery} /></Spin>
        <hr />
        { data && <Button disabled={(! data.search.pageInfo.hasNextPage) || loading} size="large" type="primary" onClick={onSubmitNextPage(2, data.search.pageInfo.endCursor, query, data, setData, setLoading)}>More</Button> }
      </div>
    </AppContext.Provider>
  );
}

const preloadedQuery = preloadQuery(RelayEnvironment, GET_PAGINATION_REPOSITORY_BY_SEARCH, {
  first: 57,
  after: null,
  query: 'gfbeam',
  type: 'REPOSITORY'
});

const loadQuery = (repository) => (
  fetchQuery(RelayEnvironment, GET_REPOSITORY_BY_SEARCH, {
    repository
  })
)

const loadPaginationQuery = (first, after, query) => (
  fetchQuery(RelayEnvironment, GET_PAGINATION_REPOSITORY_BY_SEARCH, {
    first,
    after,
    query,
    type: 'REPOSITORY'
  })
)

const loadOwnerInfoQuery = (query) => (
  fetchQuery(RelayEnvironment, GET_OWNER_BY_INFO, { query })
)

const onSubmitNextPage = (first, after, query, data, setData, setLoading) => () => {
  setLoading(true)
  loadPaginationQuery(first, after, query).then((res) => {
    const { search: { edges: prevEdges } } = data
    let { search: { edges, pageInfo } } = res
    edges = prevEdges.concat(edges)
    setData({
      search: {
        edges,
        pageInfo,
        repositoryCount: res.search.repositoryCount
      }
    })
    setLoading(false)
  })
}

export default AppRoot;