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
import LaunchIcon from '@material-ui/icons/Launch';
import CopyIcon from '@material-ui/icons/FileCopy';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {accountAuth, accountLogout, accountProfile, walletDelete, changeSettings} from "../../actions";
import {connect} from "react-redux";
import Snackbar from '@material-ui/core/Snackbar';
import PlayForWorkIcon from '@material-ui/icons/PlayForWork';
import SendIcon from '@material-ui/icons/Send';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import moment from 'moment';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SmsIcon from '@material-ui/icons/Sms';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {withStyles} from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import ReactCodeInput from "react-code-input";
import Alert from "@material-ui/lab/Alert";

function Wallet({wallet, wallets, toSetup, changeSettings, walletDelete, server, onChangeWallet}) {
    const [txs, setTxs] = useState([]);
    const [msgsFrom, setMsgsFrom] = useState([]);
    const [msgsTo, setMsgsTo] = useState([]);
    const [balance, setBalance] = useState(null);
    const [balanceInDol, setBalanceInDol] = useState(0);

    const [isSyncining, setSyncining] = useState(false);
    const [tonPrice, setTonPrice] = useState(0.5763);

    const [pin, setPin] = useState('');
    const [pinResult, setPinResult] = useState('');

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
    }, [server, wallet])


    const refresh = () => {

        setSyncining(true)
        const client = TonSdk.client(server)
        TonSdk.balance(client, wallet.addr).then((res) => {
            if (res.result.length > 0 && res.result[0].balance) {
                let rawB = res.result[0].balance
                let balance = convert(rawB, 3)
                setBalance(balance)
                setBalanceInDol((balance * tonPrice).toFixed(3))
            }else{
                setBalance("0")
                setBalanceInDol(0)
            }
        }).then(()=>{
           client.close()
        }).then(()=>{
            TonSdk.txs(client, wallet.addr, wallet.keys.public).then(txs => {
                setTxs(txs)
                setSyncining(false)
            })
        })
    }

    const send = (to, amount, comment) => {
        const client = TonSdk.client(server)
        setSendLoader(true)
        TonSdk.send(client, wallet.keys, to, amount, comment, wallet.contract, wallet.addr).then((e)=>{
            handleCloseSend()
            refresh()
            setSendLoader(false)
        }).catch(e=>{
            setSendLoader(false)
            debugger
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
    const [copied, setCopied] = React.useState(false);
    const [openSettings, setOpenSettings] = React.useState(false);
    const [openPin, setOpenPin] = React.useState(false);
    const [openAddress, setOpenAddress] = React.useState(false);
    const [openSend, setOpenSend] = React.useState(false);
    const [sendLoader, setSendLoader] = React.useState(false);
    const [sendAddr, setSendAddr] = React.useState('');
    const [sendComment, setSendComment] = React.useState('');
    const [sendAmount, setSendAmount] = React.useState('');

    const handleClickOpenSettings = () => {
        setOpenSettings(true);
    };

    const handleCloseSettings = () => {
        setOpenSettings(false);
    };

    const handleClickOpenPin = () => {
        setOpenPin(true);
    };

    const handleClosePin = () => {
        setOpenPin(false);
    };


    const handleClickOpenAddress = () => {
        setOpenAddress(true);
    };

    const handleCloseAddress = () => {
        setOpenAddress(false);
    };

    const handleClickOpenSend = () => {
        setOpenSend(true);
    };

    const handleCloseSend= () => {
        setOpenSend(false);
    };

    const short = (addr) => {
        return addr.substr(0, 3) + "..." + addr.substr(-5)
    }

    const short2 = (addr) => {
        return addr.substr(0, 3) + "..." + addr.substr(-3)
    }

    const isNotEmpty = (msg) => {
        return msg && msg !== ''
    }

    const styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        }
    });

    const WDialogTitle = withStyles(styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
        );
    })

    return [<AppBar position="static" color="default">
        <Toolbar>
            <IconButton color="primary" aria-label="upload picture" component="span">
                {isSyncining && <CircularProgress size={24} />}
                {!isSyncining && <SyncIcon onClick={refresh}/>}
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
                {wallet.label ? wallet.label : "Account  [" + wallet.addr.substr(2, 1) + '' + wallet.addr.substr(-1) + ']'}

            </Typography>

            <CopyToClipboard text={wallet.addr} onCopy={() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1000)
            }
            }>
                <Typography
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onClick={handlePopoverClose}
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                    variant={"subtitle2"} className={classes.title2}>
                    {short(wallet.addr)}
                    <IconButton color="primary" size="small" aria-label="upload picture" component="span">
                        <CopyIcon fontSize="inherit"/>
                    </IconButton>
                </Typography>
            </CopyToClipboard>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                autoHideDuration={2000}
                open={copied}
                message="Copied!"
            />
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
            <IconButton edge="end" className={classes.menuButton} onClick={handleClickNet} color="inherit"
                        aria-label="menu">
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorElNet}
                keepMounted
                open={Boolean(anchorElNet)}
                onClose={handleCloseNet}
            >
                {wallets.map((w, i) => <MenuItem key={w.id}>

                    <ListItemText primary={w.label ? w.label : 'Account ' + (i + 1)}
                                  onClick={(e)=>{
                        onChangeWallet(w.id)
                                      setAnchorElNet(null)
                    }}/>
                    <ListItemSecondaryAction>
                        <IconButton color="primary" edge="end"  aria-label="upload picture" component="div">
                            <SettingsIcon  onClick={() => {
                                setWalletEdit(w)
                                setOpenSettings(true)
                            }}/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </MenuItem>)}

                <MenuItem style={{justifyContent: "center"}}>
                    <ListItemIcon edge="center">
                        <Fab size="small" color="secondary" aria-label="add">
                            <AddIcon onClick={toSetup}/>
                        </Fab>
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </Toolbar>
    </AppBar>,
        <Divider/>,
        <Dialog open={openPin} onClose={handleClosePin} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                {pinResult === '' && <span>Pin code</span>}
                {pinResult !== '' && <span>Please, save you seed phrase</span>}
            </DialogTitle>
            <DialogContent>
                {pinResult === '' && <DialogContentText>
                    Please, set pin code for you wallet.
                </DialogContentText>}
                {pinResult === '' && <ReactCodeInput type='password' fields={4} onChange={(e) => {
                    setPin(e)
                }}/>}

                {pinResult !== '' && <Alert severity="success">{pinResult}</Alert>}

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    if (pinResult !== '') {
                        handleClosePin()
                    } else {
                        if (walletEdit.pin === pin) {
                            setPinResult(walletEdit.seed)
                        } else {
                            setPinResult("You pin is not correct")
                        }

                    }

                }} color="primary" disabled={pin.length !== 4}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>,
        <Dialog open={openSettings} onClose={handleCloseSettings} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Wallet settings</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You could change wallet labels.
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
                    onChange={(e) => walletEdit.label = e.target.value}
                    defaultValue={walletEdit && walletEdit.label ? walletEdit.label : 'Account'}
                    type="email"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    walletDelete({...walletEdit})
                    handleCloseSettings()
                }} color="secondary">
                    Delete
                </Button>
                <Button onClick={() => {
                    setPin("")
                    setPinResult("")
                    handleCloseSettings()
                    handleClickOpenPin()
                }} color="secondary">
                    Backup
                </Button>
                <Button onClick={handleCloseSettings} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => {
                    changeSettings({...walletEdit})
                    handleCloseSettings()
                }} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>,
        <Dialog open={openAddress} onClose={handleCloseAddress} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Wallet address</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You wallet address:
                </DialogContentText>

                {wallet && wallet.addr}
                <CopyToClipboard text={wallet.addr} onCopy={() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1000)
                }
                }>
                    <IconButton color="primary" size="small" aria-label="upload picture" component="span">
                        <CopyIcon fontSize="inherit"/>
                    </IconButton>
                </CopyToClipboard>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseAddress} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>,
        <Dialog open={openSend} onClose={handleCloseSend} aria-labelledby="customized-dialog-title">
            <WDialogTitle id="form-dialog-title" onClose={handleCloseSend}>Send TON's</WDialogTitle>
            <DialogContent>
                <DialogContentText>
                    You wallet address:
                </DialogContentText>

                <Grid container spacing={3} style={{width:400}}>
                    <Grid item xs={12}>
                        <TextField
                            label="From"
                            defaultValue={wallet.addr}
                            variant="filled"
                            disabled={true}
                            fullWidth={true}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                        <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                        <Input
                            label="Amount"
                            defaultValue={''}
                            onChange={(e)=>setSendAmount(e.target.value)}
                            placeholder="0.000"
                            variant="filled"
                            fullWidth={true}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="To"
                            placeholder="Please, insert TON address"
                            defaultValue={''}
                            onChange={(e)=>setSendAddr(e.target.value)}
                            variant="filled"
                            fullWidth={true}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Comment"
                            placeholder="Comment"
                            defaultValue={''}
                            onChange={(e)=>setSendComment(e.target.value)}
                            variant="filled"
                            fullWidth={true}
                        />
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{
                    send(sendAddr, sendAmount, sendComment)
                }} color="primary" disabled={sendAddr === '' || sendAmount === ''|| sendLoader}>
                    Send
                </Button>
            </DialogActions>
        </Dialog>,
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                    <Typography variant="h4" noWrap className={classes.tonCurrency}>{balance} TON</Typography>
                    <Box variant="h7" fontWeight="fontWeightMedium" className={classes.altCurrency}>~ {balanceInDol}
                        $</Box>

                </Paper>
            </Grid>
            <Grid item xs={12} spacing={3} >
                <Fab size="small" color="primary" aria-label="add"  variant="extended" onClick={handleClickOpenAddress}>
                    <PlayForWorkIcon onClick={handleClickOpenAddress}/>
                    Receive
                </Fab>
                &nbsp;  &nbsp;
                <Fab size="small" color="secondary" aria-label="add" variant="extended" onClick={handleClickOpenSend}>
                    <ArrowUpwardIcon onClick={handleClickOpenSend}/>
                    Send
                </Fab>
            </Grid>

        </Grid>,
        <Paper square>
            <Timeline>
            {(txs).concat(msgsFrom).concat(msgsTo).sort((a, b) => b.now - a.now).map(d => <TimelineItem>
                <TimelineOppositeContent>
                    <Typography color="subtitle1">
                        {moment(d.now * 1000).fromNow(true)}
                    </Typography>

                    <Typography color="textSecondary">
                        {moment(d.now * 1000).format('DD/MM/YYYY')}
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    {d.msg_type && <TimelineDot style={{backgroundColor: '#36c05c'}}/>}
                    {!d.msg_type && <TimelineDot variant="outlined"/>}
                    <TimelineConnector/>
                </TimelineSeparator>
                <TimelineContent>
                    <Grid container direction="row" justify="flex-start" spacing={1}
                          alignItems="flex-start"
                    >
                        <Grid item xs={3}>
                            <CopyToClipboard text={d.id} onCopy={() => {
                                setCopied(true)
                                setTimeout(() => setCopied(false), 1000)
                            }
                            }>
                                <IconButton color="primary" size="small" aria-label="upload picture" component="span">
                                    <CopyIcon fontSize="inherit"/>
                                </IconButton>
                            </CopyToClipboard>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography align={"left"}>{short2(d.id)}</Typography>
                        </Grid>

                        {isNotEmpty(d.tokens) && <Grid item xs={3}>
                            <IconButton color="primary" size="small" aria-label="upload picture" component="span">
                                <MonetizationOnIcon fontSize="inherit"/>
                            </IconButton>
                        </Grid>}
                        {isNotEmpty(d.tokens) && <Grid item xs={9}>
                            <Box color="textSecondary" textAlign={"left"} textOverflow="ellipsis">{d.tokens}</Box>
                        </Grid>}

                        {isNotEmpty(d.msg) && <Grid item xs={3}>
                            <IconButton color="primary" size="small" aria-label="upload picture" component="span">
                                <SmsIcon fontSize="inherit"/>
                            </IconButton>
                        </Grid>}
                        {isNotEmpty(d.msg) && <Grid item xs={9}>
                            <Box color="textSecondary" textAlign={"left"} component="div" textOverflow="ellipsis"
                                 style={{maxWidth: "100px", overflow: "hidden"}}>{d.msg}</Box>
                        </Grid>}
                    </Grid>

                </TimelineContent>
            </TimelineItem>)}
        </Timeline></Paper>]
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
