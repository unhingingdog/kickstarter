import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import Header from './Header'
import Head from 'next/head'

export default ({ children }) => {
  return(
    <Container>
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css">
        </link>
      </Head>
      <Header />
      <div>
        {children}
      </div>
    </Container>
  )
}
