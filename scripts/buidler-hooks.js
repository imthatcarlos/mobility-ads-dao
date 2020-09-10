/*
 * These hooks are called by the Aragon Buidler plugin during the start task's lifecycle. Use them to perform custom tasks at certain entry points of the development build process, like deploying a token before a proxy is initialized, etc.
 *
 * Link them to the main buidler config file (buidler.config.js) in the `aragon.hooks` property.
 *
 * All hooks receive two parameters:
 * 1) A params object that may contain other objects that pertain to the particular hook.
 * 2) A "bre" or BuidlerRuntimeEnvironment object that contains enviroment objects like web3, Truffle artifacts, etc.
 *
 * Please see AragonConfigHooks, in the plugin's types for further details on these interfaces.
 * https://github.com/aragon/buidler-aragon/blob/develop/src/types.ts#L22
 */

const fs = require('fs');
const path = require('path');
const CONTRACTS_FILE = './../../dark-horse-mobility-contracts/contracts.json';

module.exports = {
  // Called before a dao is deployed.
  preDao: async ({}, { web3, artifacts }) => {},

  // Called after a dao is deployed.
  postDao: async ({ dao }, { web3, artifacts }) => {
    const MobilityCampaigns = artifacts.require('./MobilityCampaigns');
    const filePath = path.join(__dirname, CONTRACTS_FILE);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data[web3.givenProvider._networkName]['MobilityAdVoting'] = dao.address;
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');

    try {
      // set the voting contract address
      const accounts = await web3.eth.getAccounts();
      const contract = await MobilityCampaigns.at(data[web3.givenProvider._networkName]['MobilityCampaigns']);
      await contract.setAdVotingAddress(dao.address, { from: accounts[0] });
      console.log(`MobilityCampaigns.setAdVotingAddress() with DAO address: ${dao.address}`);

      // enable ad rewards for the default account
      await contract.enableNewUser({ from: accounts[0] });
      console.log(`MobilityCampaigns.enableNewUser() with default account: ${accounts[0]}`);
    } catch (error) {
      console.log(error);
    }
  },

  // Called after the app's proxy is created, but before it's initialized.
  preInit: async ({ proxy }, { web3, artifacts }) => {},

  // Called after the app's proxy is initialized.
  postInit: async ({ proxy }, { web3, artifacts }) => {},

  // Called when the start task needs to know the app proxy's init parameters.
  // Must return an array with the proxy's init parameters.
  getInitParams: async ({}, { web3, artifacts }) => {
    const filePath = path.join(__dirname, CONTRACTS_FILE);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return [data[web3.givenProvider._networkName]['MobilityCampaigns']];
  },

  // Called after the app's proxy is updated with a new implementation.
  postUpdate: async ({ proxy }, { web3, artifacts }) => {}
};
