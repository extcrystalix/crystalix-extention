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

export default function Wallet() {
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


    const classes = useStyles();


    return [<AppBar position="static" color="default">
        <Toolbar>
            <Typography variant="h6" noWrap className={classes.title}>
                Account 1

            </Typography>
        </Toolbar>
    </AppBar>,
        <Divider/>,
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper elevation={0} className={classes.paper}>
                    <Typography variant="h4" noWrap className={classes.tonCurrency}>1.22 TON</Typography>
                    <Box variant="h7" fontWeight="fontWeightMedium" className={classes.altCurrency}>~ 39,9
                        $</Box>

                </Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper elevation={0} className={classes.paper}>xs=6</Paper>
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