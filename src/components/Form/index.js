import React, { useState, useEffect, useContext } from 'react';
import { Input } from 'antd'
import { AppContext } from '../../App'

const { Search } = Input

function Form(props) {
   const { loadQuery, loadPaginationQuery } = props
   const { data, setData, loading, setLoading, setQuery } = useContext(AppContext)

   const onSubmitPaginationQuery = (value) => {
      setLoading(true)
      setQuery(value)
      loadPaginationQuery(2, null, value).then((res) => { console.log('pagination::', res); setData(res); setLoading(false) })
      // e.preventDefault()
   }

   return (
      <>
         <form>
            <label htmlFor="url">
               Show respository for https://github.com/◐▽◑/
         </label>
            <Search
               placeholder="input search text"
               enterButton="Search"
               size="large"
               style={{ width: '257px', verticalAlign: 'middle' }}
               onSearch={onSubmitPaginationQuery}
               disabled={loading}
            />
         </form>
      </>
   )
}

export default Form