import web3 from './web3'
import CampaignFactory from './build/CampaignFactory'
import factoryAddress from './factoryAddress'

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  factoryAddress
)

export default instance
