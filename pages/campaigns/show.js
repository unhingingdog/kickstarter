import React, { Component } from 'react'
import Layout from '../../components/Layout'
import ContributeForm from '../../components/ContributeForm'
import web3 from '../../ethereum/web3'
import Campaign from '../../ethereum/campaign'
import { Card, Grid, Button } from 'semantic-ui-react'
import { Link } from '../../routes'

export default class ShowCampaign extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address)
    const summary = await campaign.methods.getSummary().call()

    return {
      minimimContribution: summary[0],
      balance: summary[1],
      requests: summary[2],
      contributorCount: summary[3],
      manager: summary[4],
      address: props.query.address
    }
  }


  renderCards = () => {
    const {
      minimimContribution,
      balance,
      requests,
      contributorCount,
      manager
    } = this.props

    const items = [
      {
        header: manager,
        meta: 'Address of manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimimContribution,
        meta: 'Minimum contribution (Wei)',
        description: 'Minimum Wei required to become an approver'
      },
      {
        header: contributorCount,
        meta: 'Contributor Count',
        description: 'The number of contributors to this campaign'
      },
      {
        header: requests,
        meta: 'Pending Requests',
        description: 'Requests awaiting approval by contributors'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Balance',
        description: 'Current balance of the campaign'
      }
    ]

    return <Card.Group items={items} />
  }

  render() {
    return(
      <Layout>
        <h3>Campaign show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`} >
                <a>
                  <Button primary>Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}
