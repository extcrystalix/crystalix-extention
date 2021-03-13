import React, {useState, useEffect} from 'react';
import '../Popup/App.css'
import logo from '../../asset/48.png';
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
import TonSdk from "../../sys/TonSdk";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default function Wallet({wallet}) {
    const [currentAddress, setCurrentAddress] = useState(null);
    const [balance, setBalance] = useState(null);

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
            color: "#989a9b",
            cursor: 'pointer',
            '&:hover': {
                background: "#f0f1f2",
            },
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
        popover: {
            pointerEvents: 'none',
        },
    }));
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
    useEffect(async () => {
        if(wallet){
            const client = TonSdk.client('main.ton.dev')
            TonSdk.balance(client, wallet.addr).then((res)=>{
                let rawB = res.result[0].balance
                let balance = convert(rawB, 3)
                setBalance(balance)
            })
        }
    }, [])


    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const classes = useStyles();

    return [<AppBar position="static" color="default">
        <Toolbar>
            <Typography variant="h6" noWrap className={classes.title}>
                Account 1
            </Typography>

            <CopyToClipboard text={wallet.addr}>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                variant={"subtitle2"} className={classes.title2}>
                {wallet.addr.substr(0,7)}... {wallet.addr.substr(-5)}
            </Typography>
            </CopyToClipboard>
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>Copy to clipboard</Typography>
            </Popover>
            <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu">
                <MoreVertIcon/>
            </IconButton>
        </Toolbar>
    </AppBar>,
        <Divider/>,
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                    <Typography variant="h4" noWrap className={classes.tonCurrency}>{balance} TON</Typography>
                    <Box variant="h7" fontWeight="fontWeightMedium" className={classes.altCurrency}>~ 39,9
                        $</Box>

                </Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper elevation={0} className={classes.paper}>
                    {JSON.stringify(wallet)}
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper elevation={0} className={classes.paper}>xs=6</Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper elevation={0} className={classes.paper}>xs=3</Paper>
            </Grid>
            <Grid item xs={12}>

            </Grid>
        </Grid>]
}