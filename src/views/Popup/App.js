import React, {useState, useEffect} from 'react';
import './App.css'
import logo from './../../asset/48.png';
import {Button, Divider, Avatar} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Chip from '@material-ui/core/Chip';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import ExpandMore from '@material-ui/icons/ExpandMore';
import Adjust from '@material-ui/icons/Adjust';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {TonClient} from "@tonclient/core";
import {libWeb} from "@tonclient/lib-web";
import Wallet from "./Wallet";

import SetcodeMultisig2 from './../../contracts/SetcodeMultisigWallet2.json';
import SetcodeMultisig from './../../contracts/SetcodeMultisigWallet.json';
import SafeMultisigWallet from './../../contracts/SafeMultisigWallet.json';


function App() {
    TonClient.useBinaryLibrary(libWeb);

    const [currentAddress, setCurrentAddress] = useState(null);

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {},
        title: {
            flexGrow: 1,
        },
        title2: {
            flexGrow: 1,
            color: "#989a9b"
        },
        header: {
            backgroundColor: "#f0f1f2",
            color: "#6e767f",
            boxShadow: 'none'
        },
        headerAcc: {
            backgroundColor: "#FFF",
            color: "#000",
            boxShadow: 'none'
        },
        account: {
            display: 'flex',
            justifyContent: 'center',
        },
        accountSelect: {
            padding: 10,
            margin: 10,
            borderRadius: 10,
            cursor: 'pointer',
            '&:hover': {
                background: "#f0f1f2",
            },
        },
        typography: {
            padding: theme.spacing(2),
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
        },
        altCurrency: {
            color: '#848c96'
        },
        tonCurrency: {
            fontWeight: 600
        },
    }));


    async function generateSeed(server) {
        try {
            const client = await this.ton.getClient(server);
            return await client.crypto.mnemonicFromRandom(
                {dictionary: this.ton.seedPhraseDictionaryEnglish, wordCount: this.ton.seedPhraseWorldCount}
            );
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(async () => {
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
        const {address} = await client.abi.encode_message(deployOptions);
        setCurrentAddress(address)
        console.log(`Future address of the contract will be: ${address}`);


    });

    const servers = [
        {server: "main.ton.dev", desciption: "main network"},
        {server: "net.ton.dev", desciption: "test network"}
    ]

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [server, setServer] = useState(servers[0].server);

    useEffect(() => {
        // TonClient.useBinaryLibrary(libWeb);
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    const [darkState, setDarkState] = useState(false);
    const palletType = darkState ? "dark" : "light";

    const darkTheme = createMuiTheme({
        palette: {
            type: palletType,
        }
    });

    const handleThemeChange = () => {
        setDarkState(!darkState);
    };

    /** select net **/
    const [anchorElNet, setAnchorElNet] = useState(null);

    const handleClickNet = (event) => {
        setAnchorElNet(event.currentTarget);
    };

    const handleCloseNet = () => {
        setAnchorElNet(null);
    };


    return (
            <ThemeProvider theme={darkTheme}>
                <div className="App">
                    <AppBar position="static"   color="default">
                        <Toolbar>
                            <Avatar alt="Crystalix" src={logo}/>
                            <Typography variant="h6" noWrap className={classes.title}>
                                <Chip label={server} clickable deleteIcon={<ExpandMore/>} onClick={handleClickNet}
                                      onDelete={handleClickNet} color="primary"/>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorElNet}
                                    keepMounted
                                    open={Boolean(anchorElNet)}
                                    onClose={handleCloseNet}
                                >
                                    {servers.map((net) => <MenuItem key={net.server} onClick={() => {
                                        handleCloseNet()
                                        setServer(net.server)
                                    }
                                    }>
                                        <ListItemIcon>
                                            <Adjust fontSize="small"/>

                                        </ListItemIcon>
                                        <Typography variant="inherit" >
                                            {net.server}
                                        </Typography>
                                    </MenuItem>)}

                                </Menu>
                            </Typography>

                        </Toolbar>
                    </AppBar>

                    <Wallet />

                    <Button variant="contained" color="primary" onClick={() => handleThemeChange()}>
                        Primary
                    </Button>

                </div>
            </ThemeProvider>
    );
}

export default App
