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
import WifiIcon from '@material-ui/icons/Wifi';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
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
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import SettingsIcon from '@material-ui/icons/Settings';
import SyncIcon from '@material-ui/icons/Sync';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {accountAuth, accountLogout, accountProfile, walletDelete, changeSettings} from "../../actions";
import {connect} from "react-redux";

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import moment from 'moment';

function Wallet({wallet,wallets, toSetup, changeSettings, walletDelete, server}) {
    const [txs, setTxs] = useState([]);
    const [msgs, setMsgs] = useState([]);
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
        refresh()
    }, [])



    const refresh = () => {
        const client = TonSdk.client(server)
        TonSdk.balance(client, wallet.addr).then((res)=>{
            if(res.result.length  > 0 && res.result[0].balance) {
                let rawB = res.result[0].balance
                let balance = convert(rawB, 3)
                setBalance(balance)
            }
            TonSdk.txs(client, wallet.addr).then(tx=>{
                if(tx && tx.result) setTxs(tx.result)
            })
            TonSdk.msgsFrom(client, wallet.addr).then(msgs=>{
                let blocks = msgs.result.map(d=>{
                    let b = {}
                    b.id = d.id
                    b.now = d.created_at
                    b.msg_type = d.msg_type
                    return b
                })
                setMsgs(blocks)
            })

        })
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const classes = useStyles();

    /** select net **/
    const [anchorElNet, setAnchorElNet] = useState(null);

    const handleClickNet = (event) => {
        setAnchorElNet(event.currentTarget);
    };

    const handleCloseNet = () => {
        setAnchorElNet(null);
    };

    const [walletEdit, setWalletEdit] = React.useState(null);
    const [openSettings, setOpenSettings] = React.useState(false);

    const handleClickOpenSettings = () => {
        setOpenSettings(true);
    };

    const handleCloseSettings = () => {
        setOpenSettings(false);
    };

    const short = (addr) => {
        return addr.substr(0,7) + "..." + addr.substr(-5)
    }

    return [<AppBar position="static" color="default">
        <Toolbar>
            <IconButton color="primary" aria-label="upload picture" component="span">
                <SyncIcon onClick={refresh} />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
                {wallet.label ? wallet.label : "Account  [" + wallet.addr.substr(2,1) + ''+ wallet.addr.substr(-1) + ']'}
            </Typography>

            <CopyToClipboard text={wallet.addr}>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                variant={"subtitle2"} className={classes.title2}>
                {short(wallet.addr)}
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
            <IconButton edge="end" className={classes.menuButton}  onClick={handleClickNet}  color="inherit" aria-label="menu">
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorElNet}
                keepMounted
                open={Boolean(anchorElNet)}
                onClose={handleCloseNet}
            >
                {wallets.map((w,i) => <MenuItem key={w.id}>
                    <ListItemIcon>
                        <WifiIcon />
                    </ListItemIcon>
                    <ListItemText primary={w.label ? w.label : 'Account ' + (i+1)}/>
                    <ListItemSecondaryAction>
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <SettingsIcon onClick={()=>{
                                setWalletEdit(w)
                                setOpenSettings(true)
                            }} />
                        </IconButton>
                    </ListItemSecondaryAction>
                </MenuItem>)}

               <MenuItem>
                   <ListItemIcon>
                       <Fab size="small" color="secondary"  aria-label="add">
                            <AddIcon onClick={toSetup} />
                       </Fab>
                   </ListItemIcon>
                </MenuItem>
            </Menu>
        </Toolbar>
    </AppBar>,
        <Divider/>,
        <Dialog open={openSettings} onClose={handleCloseSettings} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Address"
                    type="email"
                    disabled
                    value={walletEdit && walletEdit.addr ? walletEdit.addr : ''}
                    fullWidth
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Label"
                    onChange={(e)=>walletEdit.label = e.target.value}
                    defaultValue={walletEdit && walletEdit.label ? walletEdit.label : 'Account'}
                    type="email"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button  onClick={()=>{
                    walletDelete({...walletEdit})
                    handleCloseSettings()
                }} color="secondary">
                    Delete
                </Button>
                <Button onClick={handleCloseSettings} color="primary">
                    Cancel
                </Button>
                <Button onClick={()=>{
                    changeSettings({...walletEdit})
                    handleCloseSettings()
                }} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>,
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                    <Typography variant="h4" noWrap className={classes.tonCurrency}>{balance} TON</Typography>
                    <Box variant="h7" fontWeight="fontWeightMedium" className={classes.altCurrency}>~ 39,9
                        $</Box>

                </Paper>
            </Grid>
        </Grid>,
        <Timeline align="alternate">
            {(txs).concat(msgs).sort((a,b)=>a.now - b.now).map(d=><TimelineItem>
                <TimelineOppositeContent>
                    <Typography color="textSecondary">{moment(d.now*1000).fromNow()}</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    {d.msg_type && <TimelineDot  style={{backgroundColor:'#36c05c'}}/> }
                    {!d.msg_type && <TimelineDot variant="outlined"/> }
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Typography>{short(d.id)}</Typography>
                </TimelineContent>
            </TimelineItem>)}
        </Timeline>]
}

const mapStateToProps = state => Object.assign(
    {}, state.account, state.marker
);

const mapDispatchToProps = dispatch => ({
    changeSettings: (data) => {
        dispatch(changeSettings(data));
    },
    walletDelete: (data) => {
        dispatch(walletDelete(data));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);