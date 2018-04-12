const assert = require('assert')
const ganache = require('ganache-cli')
const provider = ganache.provider()
const Web3 = require('web3')
const web3 = new Web3(provider)

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let caller
let accounts
let factory
let campaignAddress
let campaign


beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  ;[caller] = accounts

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: caller, gas: '1000000' })

  factory.setProvider(provider)

   await factory.methods.createCampaign('100')
     .send({ from: caller, gas: '1000000' })

  ;[campaignAddress] = await factory.methods.getDeployedCampaigns().call()

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  )
})

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })

  it('the caller is the campaign manager', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(manager, caller)
  })

  it('allows people to contribute money and marks them as approvers', async () => {
    const contributor = accounts[1]
    await campaign.methods.contribute().send({
      value: '200',
      from: contributor
    })
    const isContributor = await campaign.methods.contributors(contributor).call()
    assert(isContributor)
  })

  it('requires a mimimum contribution', async () => {
    const contributor = accounts[1]
    try {
      await campaign.methods.contribute().send({
        value: '50',
        from: contributor
      })
    } catch (err) {
      assert(err)
    }
  })

  it('allows a manager to make a payment request', async () => {
    const recipient = accounts[5]
    await campaign.methods.createRequest(
      "Buy batteries",
      "10000",
      recipient.toString()
    ).send({from: caller, gas: '1000000'})

    const request = await campaign.methods.requests(0).call()
    assert.equal("Buy batteries", request.description)
  })

  it('processes requests', async () => {
    const contributor = accounts[2]
    const recipient = accounts[5]

    await campaign.methods.contribute().send({
      from: contributor,
      value: web3.utils.toWei('10', 'ether')
    })

    let balance = await web3.eth.getBalance(campaignAddress)
    assert(web3.utils.fromWei(balance, 'ether') > 9.95)

    await campaign.methods
      .createRequest('a', web3.utils.toWei('5', 'ether'), recipient )
      .send({ from: caller, gas: '1000000'})

    await campaign.methods.approveRequest(0)
      .send({ from: contributor, gas: '1000000' })

    await campaign.methods.finalizeRequest(0)
      .send({ from: caller, gas: '1000000' })

    balance = await web3.eth.getBalance(campaignAddress)
    assert(web3.utils.fromWei(balance, 'ether') <= 5)

    let recipientBalance = await web3.eth.getBalance(recipient)
    recipientBalance = parseFloat(web3.utils.fromWei(recipientBalance, 'ether'))
    assert(recipientBalance > 104.99)
  })
})
