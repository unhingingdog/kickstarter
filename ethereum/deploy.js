const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/campaignFactory");

const mnu =
  "enroll bag first exist core jungle exile water bullet miracle leisure illness";
const network = "https://rinkeby.infura.io/A1VYAPaR2udWtzY2vY44";

const provider = new HDWalletProvider(mnu, network);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  console.log("Contract deployed to", result.options.address);
};
deploy();
