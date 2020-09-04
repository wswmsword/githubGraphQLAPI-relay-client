import React, { useState, useEffect, useContext } from 'react';
import { Button, Input, Modal } from 'antd'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { AppContext } from '../../App'

function Repository(props)
{
   const { loadOwnerInfoQuery } = props
   const { preloadedData, data, setLoading } = useContext(AppContext)
   const { search: { edges, pageInfo, repositoryCount } } = data == null ? preloadedData: data;
   return (
      <>
         <p style={{color: 'rgb(172,173,172)'}}>About <nobr>{ repositoryCount }</nobr> results</p>
         <ul>
            {
               edges.map(item => (
                  <li key={item.node.id}>
                     <p>
                        <strong>In Repository: </strong>
                        <a href={item.node.url} target="_blank" rel="noopener noreferrer">{item.node.name}</a>
                     </p>

                     <ul>
                        <li>
                           <p>{ item.node.description == null ? "(no description)" : item.node.description }</p>
                        </li>
                        <li>
                           <p>
                              Repository from Organization Or User: 
                              <Avatar src={item.node.owner.avatarUrl} shape="square" size="small" icon={<UserOutlined />} />
                              <Button type="link" onClick={info(loadOwnerInfoQuery, setLoading)}>{item.node.owner.login}</Button>
                              <a href={item.node.owner.url} target="_blank" rel="noopener noreferrer">LINK</a>
                           </p>
                        </li>
                        <li>
                           <p>Number of forkCount: {item.node.forkCount}</p>
                        </li>
                     </ul>
                  </li>
               ))
            }
         </ul> 
      </>
   )
}

const info = (loadOwnerInfoQuery, setLoading) => (
   (e) => {
      const query = e.target.innerText
      setLoading(true)
      loadOwnerInfoQuery(query).then(res => {
         setLoading(false)
         console.log(res)
         const {bio, email, login} = res.repositoryOwner
         Modal.info({
            title: 'Here\'s a little information of owner.',
            content: (
              <div>
                  <code>
                     bio: {bio == null ? `(no bio)` : bio};{" "}
                     email: {email === '' ? `(no email)` : email};{" "}
                     owner: {login};
                  </code>
              </div>
            ),
            onOk() {},
         });
      })
      
   }
)

export default Repository