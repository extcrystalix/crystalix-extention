import React, { useState, useEffect } from 'react';
import './App.css'
import {TonClient} from "@tonclient/core";
import {libWeb, libWebSetup} from "@tonclient/lib-web";

import SetcodeMultisig2 from './../../contracts/SetcodeMultisigWallet2.json';
import SetcodeMultisig from './../../contracts/SetcodeMultisigWallet.json';
import SafeMultisigWallet from './../../contracts/SafeMultisigWallet.json';


function App() {
  TonClient.useBinaryLibrary(libWeb);

    const [currentAddress, setCurrentAddress] = useState(null);

  async function generateSeed(server){
    try {
      const client = await this.ton.getClient(server);
      return await client.crypto.mnemonicFromRandom(
          {dictionary: this.ton.seedPhraseDictionaryEnglish, wordCount: this.ton.seedPhraseWorldCount}
      );
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(async  () => {
    const ton = {
      client: null,
      seedPhraseWorldCount: 12,
      seedPhraseDictionaryEnglish: 1,
      hdPath: "m/44'/396'/0'/0/0",
      async getClient(server) {
        if (null === this.client || server !== this.client.config.data.servers[0]) {
          // console.log(`Getting TON client for '${server}'`);
          this.client = await TonClient.create({
            servers: [server] //@TODO multiple servers??
          });
        }
        return this.client;
      },
    };


    const client = new TonClient({
      network: {
        server_address: 'net.ton.dev'
      }
    });

    const keys = await client.crypto.generate_random_sign_keys();
    console.log(keys)
    const seed = "..."
   const keys2 = await client.crypto.mnemonic_derive_sign_keys({
      dictionary: 1,
      wordCount: 12,
      phrase: seed,
      path: "m/44'/396'/0'/0/0"
    });


    //https://docs.ton.dev/86757ecb2/p/33b76d-quick-start
//SetcodeMultisig2  SetcodeMultisig SafeMultisigWallet
      const abi = {
          type: 'Contract',
          value: SetcodeMultisig.abi
      }
      const deployOptions = {
          abi,
          deploy_set: {
              tvc: SetcodeMultisig.imageBase64,
              initial_data: {}
          },
          call_set: {
              function_name: 'constructor',
              input: {owners: [`0x${keys2.public}`], reqConfirms: 1}
          },
          signer: {
              type: 'Keys',
              keys: keys2
          }
      }

      // Encode deploy message
      // Get future `Hello` contract address from `encode_message` result
      // to sponsor it with tokens before deploy
      const { address } = await client.abi.encode_message(deployOptions);
      setCurrentAddress(address)
      console.log(`Future address of the contract will be: ${address}`);



  });




  return (
    <div className="App">
      <header className="App-header">
        <p>Popup page {currentAddress}</p>
        <p>
          Edit <code>src/views/Popup/App.js</code> and save.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App
