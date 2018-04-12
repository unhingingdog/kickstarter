import React, { Component } from 'react'
import { Table, Button } from 'semantic-ui-react'
import web3 from '../ethereum/web3'
import Campaign from '../ethereum/campaign'

export default class ReqeustRow extends Component {
  onApprove = async () => {
    const accounts = await web3.eth.getAccounts()
    const campaign = Campaign(this.props.address)
    console.log(accounts[0])
    await campaign.methods.approveRequest(this.props.id)
      .send({ from: accounts[0] })
  }

  onFinalise = async () => {
    const accounts = await web3.eth.getAccounts()
    const campaign = Campaign(this.props.address)

    await campaign.methods.finalizeRequest(this.props.id)
      .send({ from: accounts[0] })
  }

  render() {
    const { Row, Cell } = Table
    const { id, request, address, contributorCount, onApprove } = this.props
    const complete = request.approved
    const readyToFinalise = request.approvalCount > contributorCount / 2

    return(
      <Row disabled={complete} positive={readyToFinalise && !complete} >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient.substr(0,20) + '...' }</Cell>
        <Cell>{request.approvalCount + '/' + contributorCount }</Cell>
        <Cell>
          <Button color="green" basic onClick={this.onApprove} disabled={complete} >
            Approve
          </Button>
        </Cell>
        <Cell>
          <Button color="blue" basic onClick={this.onFinalise} disabled={complete} >
            Finalise
          </Button>
        </Cell>
      </Row>
    )
  }
}
