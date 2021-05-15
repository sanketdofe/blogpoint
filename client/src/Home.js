import React, { Fragment , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router-dom';

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
    color: "#FFFFFF",
    margin: '0 5px'
  },
  accountbutton: {
    color: "#34656d",
    fontWeight: 600
  },
  blogtype: {
    margin: '1%',
    color: '#34656d'
  },
  cardstack: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    width: '100%'
  },
  card: {
    display: 'block',
    width: '25%',
    minWidth: '184px',
    margin: '0.5rem',
    borderRadius: '0.25rem'
  },
  cardbutton: {
    color: "#34656d"
  },
  image: {
    height: 140,
  }
  
}));

export default function Home() {
  const classes = useStyles();
  const history = useHistory();

  let accesstoken = sessionStorage.getItem("accesstoken");
  let name = sessionStorage.getItem("name");
  const [loggedIn, setLoggedIn] = React.useState(accesstoken !== null);
  useEffect(() => {
    setLoggedIn(accesstoken !== null);
  });
  let blogtypes = [1, 2, 3, 4, 5, 6];
  let shortblogs = [1, 2, 3, 4, 5, 6];


  function handleLoginButton(e){
    history.push('/login');
  }

  function handleLogout(e){
    sessionStorage.removeItem("accesstoken");
    sessionStorage.removeItem("name");
    setLoggedIn(accesstoken !== null);
    history.push('/');
  }

  function handleAccountButton(e){
    history.push('/');
  }
  

  const loginbutton = <Button className={classes.button} variant="outlined" onClick={handleLoginButton} size="small">Login</Button>
  const accountbutton = 
    <div>
      <Button className={classes.accountbutton} variant="" onClick={handleAccountButton} size="small">{name}</Button>
      <Button className={classes.button} variant="outlined" onClick={handleLogout} size="small">Logout</Button>
    </div>

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
        {loggedIn ? accountbutton: loginbutton}
        </Toolbar>
      <Toolbar component="nav" variant="dense" className={classes.blogtypetoolbar}>
        {
          blogtypes.map((type) => (
            <Link
              noWrap
              key='Fashion'
              variant="subtitle1"
              href='fashion'
              className={classes.blogtype}
            >
              Fashion
            </Link>
          ))
        }
      </Toolbar>
      <Container className={classes.cardstack}>
        {
          shortblogs.map(shortblog => (
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.image}
                  image="https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" className={classes.cardbutton}>
                  Read More
                </Button>
              </CardActions>
            </Card>
          ))
        }
      </Container>
    </Fragment>
  );
}
