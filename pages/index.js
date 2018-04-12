import React from 'react'
import factory from '../ethereum/factory'
import Layout from '../components/Layout'
import { Card, Button } from 'semantic-ui-react'
import { Link } from '../routes'

export default class CampaignIndex extends React.Component {

  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call()

    return { campaigns }
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(campaign => {
      return {
        header: campaign,
        description: (
          <Link route={`campaigns/${campaign}`}>
            <a>view campaign</a>
          </Link>
        ),
        fluid: true
      }
    })
    return <Card.Group items={items} />
  }

  render() {
    return(
    <Layout>
      <div>
        <h3>Open Campaigns</h3>

        <Link route="campaigns/new">
          <a>
            <Button
              content="create campaign"
              icon="add circle"
              primary
              floated="right"
            />
          </a>
        </Link>

        {this.renderCampaigns()}
      </div>
    </Layout>
    )
  }
}
