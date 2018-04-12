import React, { Component } from 'react'
import { Link } from '../../../routes'
import Layout from '../../../components/Layout'
import { Button, Table } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'
import RequestRow from '../../../components/RequestRow'

export default class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query
    const campaign = Campaign(address)
    const contributorCount = await campaign.methods.contributorCount().call()
    const requestCount = await campaign.methods.getRequestCount().call()

  const requests = await Promise.all(
    Array(parseInt(requestCount)).fill().map((element, index) => {
        return campaign.methods.requests(index).call()
      })
    )

    return { address, requests, requestCount, contributorCount }
  }

  renderRow() {
    return this.props.requests.map((request, index) => {
      return(
        <RequestRow
          request={request}
          key={index}
          id={index}
          address={this.props.address}
          contributorCount={this.props.contributorCount}
        />
      )
    })
  }

  render() {
    const { address } = this.props
    const { Header, Row, HeaderCell, Body} = Table

    return(
      <Layout>
        <Link route={`/campaigns/${address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>Add request</Button>
          </a>
        </Link>
        <h3>Requests list</h3>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalise</HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRow()}
          </Body>
        </Table>
        <div>Total requests: {this.props.requestCount}</div>
      </Layout>
    )
  }
}
