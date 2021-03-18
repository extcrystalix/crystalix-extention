// eslint-disable-next-line no-undef
import {TonClient, Account, signerKeys, abiContract} from "@tonclient/core";
import {libWeb} from "@tonclient/lib-web";
import SetcodeMultisig from './../contracts/SetcodeMultisigWallet.json';
import SetcodeMultisig2 from './../contracts/SetcodeMultisigWallet2.json';
import SafeMultisigWallet from "./../contracts/SafeMultisigWallet.json";
//https://docs.ton.dev/86757ecb2/p/33b76d-quick-start
//SetcodeMultisig2  SetcodeMultisig SafeMultisigWallet
//https://github.com/tonlabs/sdk-samples/blob/master/examples/query/index.js
//https://docs.ton.dev/86757ecb2/p/35a3f3-field-descriptions/t/3383bd
//https://github.com/tonlabs/sdk-samples/blob/master/examples/transfer-with-comment/index.js
const contractors = {
    "SafeMultisigWallet": SafeMultisigWallet,
    "SetcodeMultisig2": SetcodeMultisig2,
    "SetcodeMultisig": SetcodeMultisig
}
const transferAbi = {
    "ABI version": 2,
    "functions": [
        {
            "name": "transfer",
            "id": "0x00000000",
            "inputs": [{"name":"comment","type":"bytes"}],
            "outputs": []
        }
    ],
    "events": [],
    "data": []
}

const convert = (amountNano, decimalNum) => {
    const minDecimalNum = 3;
    const amountBigInt = amountNano;
    const integer = amountBigInt / '1000000000';
    const reminderStr = (amountBigInt % '1000000000').toString();
    const decimalPrependZerosNum = 9 - reminderStr.length;
    const reminderRtrimedZeros = reminderStr.replace(/0+$/g, '');
    const decimalStr = `${'0'.repeat(decimalPrependZerosNum)}${reminderRtrimedZeros}`;
    const decimalCut = decimalStr.substr(0, decimalNum);
    const decimalResult = minDecimalNum - decimalCut.length > 0
        ? `${decimalCut}${'0'.repeat(minDecimalNum - decimalCut.length)}`
        : decimalCut;
    const integerFormatted = parseInt(integer.toLocaleString());
    return `${integerFormatted}.${decimalResult}`;
}

export default {
    // client: (server) => new TonClient({
    //     network: {
    //         server_address: server,
    //         message_retries_count: 3,
    //     },
    //     abi: {
    //         message_expiration_timeout: 30000,
    //     },
    // }),
    client: (server) => {

        let conf = {
            network: {
                server_address: server,
                message_retries_count: 3,
            },
        }
        TonClient.defaultConfig = conf;
        return TonClient.default
    },
    deployContract: (server, keys, contractId) => {
        // // debugger
        // const acc = new Account(contractors[contract], {
        //     signer: signerKeys(keys),
        // });
        //
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
                input: {owners: [`0x${keys.public}`], reqConfirms: 0},
                useGiver: true,
            },
            signer: {
                type: 'Keys',
                keys: keys
            }
        }

        return server.abi.encode_message(deployOptions);
    },
    balance: async (client, addr) => {
        return await client.net.query_collection({
            collection: "accounts",
            filter: {
                id: {
                    eq: addr,
                },
            },
            result: "balance",
        })
    },

    txs: (client, addr, pub) => {

        return client.net.query_collection({
            collection: "transactions",
            filter: {
                account_addr: {
                    eq: addr,
                },
            },
            result: "id,now,block_id,status,total_fees,in_message{id,msg_type,status,body,boc,value}",
        }).then(txs=>{

            let promises = txs.result.map(transaction=>{
                if(transaction.in_message){
                    let message = transaction.in_message.boc
                    let abi = abiContract(transferAbi)
                    let value = transaction.in_message.value
                    if(value){
                        value = parseInt(value, 16)
                    }
                    return client.abi.decode_message({
                        abi: abi,
                        message: message
                    }).then(res=>{
                        client.crypto.nacl_secret_box_open({encrypted: res.value.comment, key: pub}).then(res=>{
                            debugger
                        })
                        var comment = Buffer.from(res.value.comment, 'hex').toString()
                        transaction.msg =  comment
                        transaction.tokens =  convert(value,3)
                        return transaction
                    }).catch(e=>{
                        return transaction
                    });
                }else{
                    return Promise.resolve(transaction)
                }
            })


            return Promise.all(promises)
        })

    },
    msgsFrom: async (client, addr, keys) => {
        return await client.net.query_collection({
            collection: "messages",
            filter: {
                src: {
                    eq: addr,
                },
            },
            result: "id,msg_type,created_at,created_lt",
        })
    },
    msgsTo: async (client, addr) => {
        return await client.net.query_collection({
            collection: "messages",
            filter: {
                dst: {
                    eq: addr,
                },
            },
            result: "id,msg_type,created_at,created_lt",
        })
    },
    generateSeed: async (client, wordCount) => {
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
