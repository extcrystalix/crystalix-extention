import React, {useState, useEffect} from 'react';
import './App.css'
import logo from './../../asset/48.png';
import {Button, Divider, Avatar} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
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
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {TonClient} from "@tonclient/core";
import {libWeb} from "@tonclient/lib-web";
import Wallet from "../modules/Wallet";
import Setup from "../modules/Setup";
import {connect} from 'react-redux';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SettingsIcon from '@material-ui/icons/Settings';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import {
    accountAuth, accountProfile, accountLogout, accountTheme, changeServer
} from '../../actions/account';

import SetcodeMultisig2 from './../../contracts/SetcodeMultisigWallet2.json';
import SetcodeMultisig from './../../contracts/SetcodeMultisigWallet.json';
import SafeMultisigWallet from './../../contracts/SafeMultisigWallet.json';


function App({accountTheme, theme, changeServer, server, wallets}) {


    const [currentAddress, setCurrentAddress] = useState(null);
    const [page, setPage] = useState(null);
    const [walletIndex, setWalletIndex] = useState(0);

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
        itemIcon: {
            width: "30px",
            minWidth: "30px"
        }
    }));


    useEffect(() => {
        if ((wallets || []).length === 0) {
            setPage('setup')
        }
    }, [])

    const servers = [
        {server: "main.ton.dev", desciption: "main"},
        {server: "net.ton.dev", desciption: "dev"}
    ]

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);

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


    const [darkState, setDarkState] = useState(theme === "dark");
    const palletType = darkState ? "dark" : "light";

    const darkTheme = createMuiTheme({
        palette: {
            type: palletType,
            primary: {
                main: darkState ? "#2196f3" : "#4dabf5"
            }
        }
    });

    const handleThemeChange = () => {
        let nds = !darkState
        setDarkState(nds);
        accountTheme(nds ? "dark" : "light")
    };

    /** select net **/
    const [anchorElNet, setAnchorElNet] = useState(null);

    const handleClickNet = (event) => {
        setAnchorElNet(event.currentTarget);
    };

    const handleCloseNet = () => {
        setAnchorElNet(null);
    };

    let tryToFind = wallets.find((w)=>w.id === walletIndex)
    let currWallet = tryToFind ? tryToFind : wallets[0]

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Container disableGutters className="App">
                <AppBar position="static" color="default">
                    <Toolbar>

                        <Avatar alt="Crystalix" src={logo}/>
                        <Typography variant="h6" noWrap className={classes.title}>
                            <Chip label={server} clickable deleteIcon={<ExpandMore/>} onClick={handleClickNet}
                                  onDelete={handleClickNet} color="primary"/>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorElNet}
                                open={Boolean(anchorElNet)}
                                onClose={handleCloseNet}
                                varian={'menu'}
                            >
                                {servers.map((net) => <MenuItem key={net.server} onClick={() => {
                                    handleCloseNet()
                                    changeServer(net.server)
                                }
                                }>
                                    <ListItemIcon className={classes.itemIcon}>
                                        <Adjust fontSize="small"/>

                                    </ListItemIcon>
                                    <ListItemText primary={net.server + ' [' + net.desciption + ']'}/>
                                </MenuItem>)}

                            </Menu>
                        </Typography>

                    </Toolbar>
                </AppBar>


                {page !== 'setup' && wallets && wallets.length > 0 && <Wallet
                    toSetup={()=>setPage('setup')}
                    wallets={wallets}
                    wallet={currWallet}
                    onChangeWallet={(id)=>setWalletIndex(id)}
                />}
                {page === 'setup' && <Setup onFinish={() => setPage(null)}/>}
                {page !== 'setup' && wallets.length == 0 && <Setup isInit={wallets.length === 0} onFinish={() => setPage(null)}/>}

                {/*<Button variant="contained" color="primary" onClick={() => handleThemeChange()}>*/}
                {/*    Primary*/}
                {/*</Button>*/}

                <BottomNavigation>
                    <BottomNavigationAction label="Nearby" icon={<WbSunnyIcon />} onClick={handleThemeChange} />
                </BottomNavigation>

            </Container>

        </ThemeProvider>
    );
}

const mapStateToProps = state => Object.assign(
    {}, state.account, state.marker
);

const mapDispatchToProps = dispatch => ({
    accountAuth: data => {
        dispatch(accountAuth(data));
    },
    accountProfile: data => {
        dispatch(accountProfile(data));
    },
    accountLogout: () => {
        dispatch(accountLogout());
    },
    accountTheme: (data) => {
        dispatch(accountTheme(data));
    },
    changeServer: (data) => {
        dispatch(changeServer(data));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
