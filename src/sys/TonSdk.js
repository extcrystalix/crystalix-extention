// eslint-disable-next-line no-undef
import {TonClient, Account, signerKeys, abiContract, signerNone} from "@tonclient/core";
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
            "inputs": [{"name": "comment", "type": "bytes"}],
            "outputs": []
        }
    ],
    "events": [],
    "data": []
}

// Account is active when contract is deployed.
const ACCOUNT_TYPE_ACTIVE = 1;

// Account is uninitialized when contract is not deployed yet.
const ACCOUNT_TYPE_UNINITIALIZED = 0;

// Number of tokens required to deploy the contract.
// See https://docs.ton.dev/86757ecb2/p/6207cd-estimate-fees on how to calculate definite number.
const CONTRACT_REQUIRED_DEPLOY_TOKENS = 500_000_000;

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
            abi:{
                message_expiration_timeout: 30000,
            }
        }
        TonClient.defaultConfig = conf;
        return new TonClient(conf)
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


    send: async (server, keys, addr, amount, comment, deployContract) => {


        const address = '0:a95fa2b896d67647b2708cf30790b53b18a6880e3dfc5b54eb91d079fa08a758'
        const recipient = '0:c6d99e4d29ee66f89253c7f48be3be1ea582799ec02672ffaa97a30459971a69'


        const { result } = await server.net.query_collection({
            collection: 'accounts',
            filter: {
                id: {
                    eq: address
                }
            },
            result: 'acc_type balance code'
        });

        if (result.length === 0) {
            console.log(`You need to transfer at least 0.5 tokens for deploy to ${address} to net.ton.dev.`);
        }

        if (result[0].acc_type == ACCOUNT_TYPE_ACTIVE) {
            console.log(`Contract ${address} is already deployed`);
        }

        // Balance is stored as HEX so we need to convert it.
        if (result[0].acc_type == ACCOUNT_TYPE_UNINITIALIZED && result[0].balance <= CONTRACT_REQUIRED_DEPLOY_TOKENS) {
            console.log(`Balance of ${address} is too low for deploy to net.ton.dev`);
        }

        const response = await server.processing.process_message({
            send_events: false,
            message_encode_params: {
                abi: {
                    type: 'Contract',
                    value: SafeMultisigWallet.abi
                },
                deploy_set: {
                    tvc: SafeMultisigWallet.imageBase64,
                    initial_data: {}
                },
                call_set: {
                    function_name: 'constructor',
                    input: {
                        // Multisig owners public key.
                        // We are going to use a single key.
                        // You can use any number of keys and custodians.
                        // See https://docs.ton.dev/86757ecb2/p/94921e-multisignature-wallet-management-in-tonos-cli/t/242ea8
                        owners: [`0x${keys.public}`],
                        // Number of custodians to require for confirm transaction.
                        // We use 0 for simplicity. Consider using 2+ for sufficient security.
                        reqConfirms: 0
                    }
                },
                signer: {
                    type: 'Keys',
                    keys: keys
                },
                processing_try_index: 1
            }
        }).then(e=>{
            debugger
        }).catch((e)=>{
            debugger
        })

        debugger

        const body = (await server.abi.encode_message_body({
            abi: abiContract(transferAbi),
            call_set: {
                function_name: "transfer",
                input:{
                    comment: Buffer.from('My comment').toString('hex')
                }
            },
            is_internal: true,
            signer: signerNone(),
        })).body;


        // Prepare input parameter for 'submitTransaction' method of multisig wallet
        const submitTransactionParams = {
            dest: recipient,
            value: 1_000,
            bounce: false,
            allBalance: false,
            payload: body
        };

        // Run 'submitTransaction' method of multisig wallet
        // Create run message

        console.log("Call `submitTransaction` function");

        const params = {
            send_events: false,
            message_encode_params: {
                address,
                abi: abiContract(SafeMultisigWallet.abi),
                call_set: {
                    function_name: 'submitTransaction',
                    input: submitTransactionParams
                },

                signer: {
                    type: 'Keys',
                    keys: keys
                },
            }
        }
        // Call `submitTransaction` function
        const transactionInfo = await server.processing.process_message(params).then((e)=>{
            debugger
        }).catch((e)=>{
            debugger
        });
        console.log(transactionInfo);
        console.log("Transaction info:")
        debugger
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
        }).then(txs => {

            let promises = txs.result.map(transaction => {
                if (transaction.in_message) {
                    let message = transaction.in_message.boc
                    let abi = abiContract(transferAbi)
                    let value = transaction.in_message.value
                    if (value) {
                        value = parseInt(value, 16)
                    }
                    return client.abi.decode_message({
                        abi: abi,
                        message: message
                    }).then(res => {
                        // client.crypto.nacl_secret_box_open({encrypted: res.value.comment, key: pub}).then(res => {
                        //
                        // })
                        var comment = Buffer.from(res.value.comment, 'hex').toString()
                        transaction.msg = comment
                        transaction.tokens = convert(value, 3)
                        return transaction
                    }).catch(e => {
                        return transaction
                    });
                } else {
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
