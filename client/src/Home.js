import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HomeHeader from './HomeHeader';
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

const useStyles = makeStyles((theme) => ({
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
  button: {
    color: "#34656d"
  },
  image: {
    height: 140,
  }
  
}));

export default function Home() {
  const classes = useStyles();
  let loggedIn = false;
  let blogtypes = [1, 2, 3, 4, 5, 6];
  let shortblogs = [1, 2, 3, 4, 5, 6];
  return (
    <Fragment>
      <HomeHeader loggedIn={loggedIn}/>
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
                <Button size="small" className={classes.button}>
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
