import { Environment, Network, QueryResponseCache, RecordSource, Store } from 'relay-runtime';
import getRepositoryBySearch from './axiosGraphQL';

const oneMinute = 60 * 1000;
const cache = new QueryResponseCache({ size: 250, ttl: oneMinute });
// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text.
/**
 * 如果使用缓存，params.text 的不同查询语句
 * 对应各自的 params.name 进行分支执行。
 */
function fetchRelay(params, variables, cacheConfig) {
  console.log(params.name)
  const isQuery = params.operationKind === 'query';
  const isMutation = params.operationKind === 'mutation';
  const forceFetch = cacheConfig && cacheConfig.force;
  const fromCache = cache.get(params.text, variables);
  if (
    isQuery &&
    fromCache !== null &&
    !forceFetch
  ) {
    return fromCache.data.search
  }
  return getRepositoryBySearch(params.text, variables, isMutation, isQuery, cache);
}

// Export a singleton instance of Relay Environment configured with our network function:
export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});