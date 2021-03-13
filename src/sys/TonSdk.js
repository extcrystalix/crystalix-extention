// eslint-disable-next-line no-undef
import {TonClient} from "@tonclient/core";
import SetcodeMultisig2 from './../contracts/SetcodeMultisigWallet2.json';
import SafeMultisigWallet from "./../contracts/SafeMultisigWallet.json";
//https://docs.ton.dev/86757ecb2/p/33b76d-quick-start
//SetcodeMultisig2  SetcodeMultisig SafeMultisigWallet
const contractors = {
    "SafeMultisigWallet": SafeMultisigWallet,
    "SetcodeMultisig" : SetcodeMultisig2
}

export default {
    client: (server) => new TonClient({
        network: {
            server_address: server
        }
    }),
    generateSeed: async (client, wordCount)=> {
        const count = wordCount || 12
        return await client.crypto.mnemonic_from_random(
            {dictionary: 1, wordCount: count}
        );
    },
    getKeysBySeed: async (client, seed) => {
        return await client.crypto.mnemonic_derive_sign_keys({
            dictionary: 1,
            wordCount: 12,
            phrase: seed,
            path: "m/44'/396'/0'/0/0"
        });
    },
    getAddr: async (client, keys, contractId) => {
        const contract = contractors[contractId]
        const abi = {
            type: 'Contract',
            value: contract.abi
        }
        const deployOptions = {
            abi,
            deploy_set: {
                tvc: contract.imageBase64,
                initial_data: {}
            },
            call_set: {
                function_name: 'constructor',
                input: {owners: [`0x${keys.public}`], reqConfirms: 1}
            },
            signer: {
                type: 'Keys',
                keys: keys
            }
        }

        const {address} = await client.abi.encode_message(deployOptions);

        return address
    }
}