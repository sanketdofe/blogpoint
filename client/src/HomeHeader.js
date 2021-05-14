import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
        flex: 1,
        color: '#34656d',
        fontWeight: 700,
        fontFamily: 'KaushanScript-Regular'
    },
    button: {
        backgroundColor: '#34656d',
        color: "#FFFFFF"
    }
}));

function HomeHeader() {
    const classes = useStyles();
    return (
        <Fragment>
            <Toolbar className={classes.toolbar}>
                <Typography
                    component="h2"
                    variant="h3"
                    align="center"
                    className={classes.toolbarTitle}
                >
                    BlogPoint
                </Typography>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <Button className={classes.button} variant="outlined" size="small">Account</Button>
            </Toolbar>
        </Fragment>
    );
}


export default HomeHeader;