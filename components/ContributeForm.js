import React, { Component } from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'
import { Router } from '../routes'

export default class ContributeForm extends Component {
  state = {
    value: '',
    error: '',
    loading: false
  }

  onSubmit = async event => {
    event.preventDefault()
    this.setState({ loading: true, error: '' })

    const campaign = Campaign(this.props.address)
    const accounts = await web3.eth.getAccounts()

    try {
      await campaign.methods.contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, 'ether')
        })
      Router.replaceRoute(`/campaigns/${this.props.address}`)
    } catch(err) {
      this.setState({ error: err.message })
    }

    this.setState({ loading: false, value: '' })
  }

  render() {
    return(
      <Form onSubmit={this.onSubmit} error={!!this.state.error}>
        <Form.Field>
          <Input
            label="Ether"
            labelPosition="right"
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
          />
        </Form.Field>
        <Message error header="Error!" content={this.state.error} />
        <Button primary loading={this.state.loading}>
          Contribute
        </Button>
      </Form>
    )
  }
}
