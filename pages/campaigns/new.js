import React, { Component } from 'react'
import Layout from '../../components/Layout'
import { Form, Button, Label, Input, Message } from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import { Router } from '../../routes.js'

export default class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  }

  onSubmit = async event => {
    event.preventDefault()
    this.setState({ loading: true, errorMessage: '' })

    const accounts = await web3.eth.getAccounts()

    try {
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] })
    } catch (error) {
      this.setState({ errorMessage: error.message })
    }

    this.setState({ loading: false })
    Router.pushRoute('/')
  }

  render() {

    return(
      <Layout>
        <h3>Create a campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <Label>
              Minimum Contribution
            </Label>
            <Input
              label="Wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={ event => this.setState({
                 minimumContribution: event.target.value
              })}
            />
          </Form.Field>

          <Message
            error
            header='Errors with deployment'
            content={this.state.errorMessage.toString().substr(0,150) + '...'}
          />
          <Button primary loading={this.state.loading}>Create</Button>
        </Form>
      </Layout>
    )
  }
}
