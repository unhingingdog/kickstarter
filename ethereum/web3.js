import Web3 from 'web3';

const infura = "https://rinkeby.infura.io/A1VYAPaR2udWtzY2vY44"
let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  //in browser and metamask is running
  web3 = new Web3(window.web3.currentProvider)
} else {
  //On server || metamask not running
  const provider  = new Web3.providers.HttpProvider(infura)
  web3 = new Web3(provider)
}

export default web3;
