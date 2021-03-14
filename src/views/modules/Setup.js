import React, {useState, useEffect} from 'react';
import {Button, Divider, Avatar} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import {connect} from "react-redux";
import {createWallet} from "../../actions";
import TonSdk from "../../sys/TonSdk";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardActions from '@material-ui/core/CardActions';

function Setup({createWallet, server, onFinish}) {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [seed, setSeed] = useState(null);
    const [contract, SetContract] = useState(null);
    const contracts = [
        {id: "SafeMultisigWallet", name: 'Safe Multisig (Recommend)', info: 'Formal verified wallet contract'},
        {id: "SetcodeMultisig2", name: 'Set Code Multisig (Surf)', info: 'Current surf'},
        {id: "SetcodeMultisig", name: 'Set Code Multisig (Old Surf)', info: 'Old surf'},
    ]
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }));

    const classes = useStyles();

    const [errorSeed, setErrorSeed] = useState(false);
    const [errorContract, setErrorContract] = useState(false);
    const [errorCreation, setErrorCreation] = useState(null);

    const [phrase, setPhrase] = useState(null);

    const generateSeed = (event) => {
        const client = TonSdk.client(server)
        TonSdk.generateSeed(client).then(seed=>{
            setPhrase(seed.phrase)
        }).catch((e)=>{
            debugger
        })
        setPage('create')
    }

    const createWalletOnReduxe = (phrase, contract) => {
        setErrorCreation(null)
        const client = TonSdk.client(server)
        setLoading(true)
        TonSdk.getKeysBySeed(client, phrase).then(keys => {
            TonSdk.getAddr(client, keys, contract).then((addr)=>{
                const wallet = {id:new Date().getTime(), keys: keys, contract, addr}
                createWallet(wallet)
                onFinish(wallet.id)
                setLoading(false)
            }).catch(err => {
                setErrorCreation(err.message)
                setLoading(false)
            }).finally(()=>{
                setLoading(false)
            })
        }).catch(err => {
            setErrorCreation(err.message)
            setLoading(false)
        })
    };

    const handleClick = (event) => {
        if (!seed || seed == '') {
            setErrorSeed(true)
            return
        } else {
            setErrorSeed(false)
        }
        if (!contract || contract == '') {
            setErrorContract(true)
            return
        } else {
            setErrorContract(false)
        }
        createWalletOnReduxe(seed, contract)
    };

    const saveNewWallet = (event) => {
        var server = TonSdk.client(server)
        TonSdk.getKeysBySeed(server, phrase).then((keys)=>{
            debugger
            TonSdk.deployContract(server, keys,'SafeMultisigWallet').then(res=>{
                debugger
                createWalletOnReduxe(phrase, 'SetcodeMultisig')
            })
        })
    };


    return [<AppBar position="static" color="default">
        <Toolbar>
            <Typography variant="h6" noWrap className={classes.title}>
                Setup new Free TON wallet on {server}
            </Typography>
        </Toolbar>
    </AppBar>,
        <Divider/>,
        page === null ? <Grid item xs={12}>
            <Paper elevation={0} className={classes.paper}>
                <Button variant="contained" color="primary"  onClick={()=>setPage('restore')}>
                    Restore via seed phrase
                </Button>
                <Typography style={{paddingTop: 10}}>or</Typography>
                <Button color="secondary" onClick={generateSeed}>Create new Free Ton wallet</Button>
            </Paper>
        </Grid> : null,

        page === 'restore' ? <Paper elevation={0} className={classes.paper}>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <FormControl variant="outlined" className={classes.formControl} color="default" fullWidth>
                    <TextField
                        fullWidth
                        id="seed"
                        label="Seed phrase"
                        multiline
                        rows={4}
                        variant="outlined"
                        error={errorSeed}
                        onChange={(e) => setSeed(e.target.value)}
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="outlined" className={classes.formControl} color="default" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Contract</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="contract"
                            color="default"
                            label="Contract"
                            fullWidth={true}
                            variant="outlined"
                            error={errorContract}
                            onChange={(e) => SetContract(e.target.value)}
                        >

                            {contracts.map(c => <MenuItem value={c.id}>{c.name}</MenuItem>)}

                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    {errorCreation && <Alert severity="error">{errorCreation}</Alert>}
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleClick} style={{marginTop:10}}>
                        Restore
                    </Button>
                </Grid>
                <Grid item xs={12}>
                <Button href="#text-buttons" color="primary" onClick={()=>setPage(null)}>
                    Cancel
                </Button>
                </Grid>
            </Grid>
        </Paper> : null,
        page === 'create' ? <Paper elevation={0} className={classes.paper}>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>

                            <Alert severity="error">WARNING! Losing seed phrase is equivalent to losing all your funds.</Alert>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Save your seed
                            </Typography>
                            <Alert severity="success">{phrase}</Alert>

                        </CardContent>

                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Button  variant="outlined" color="primary" onClick={saveNewWallet} style={{marginTop:10}}>
                        I SECURELY SAVED IT
                    </Button>
                </Grid>
                <Grid item xs={12}>
                <Button href="#text-buttons" color="primary" onClick={()=>setPage(null)}>
                    Cancel
                </Button>
            </Grid>
            </Grid>
        </Paper> : null
    ]
}

const mapStateToProps = state => Object.assign(
    {}, state.account
);

const mapDispatchToProps = dispatch => ({
    createWallet: (data) => {
        dispatch(createWallet(data));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Setup);
