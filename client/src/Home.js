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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

let serveraddress = "http://localhost:5000";
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
    width: '23%',
    minWidth: '184px',
    margin: '0.5rem',
    borderRadius: '0.25rem'
  },
  cardbutton: {
    color: "#34656d",
    margin: '0 5px'
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
  let role = sessionStorage.getItem("role");
  const [loggedIn, setLoggedIn] = React.useState(accesstoken !== null);
  const [remainingBlogList, setRemainingBlogList] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [blogs, setBlogs] = React.useState([]);
  const [myBlogButton, setMyBlogButton] = React.useState(loggedIn);
  const [admin, setAdmin] = React.useState(role === 'admin');
  const [deleteButton, setDeleteButton] = React.useState(false);
  const [updated, setUpdated] = React.useState(false);
  
  useEffect(() => {
    setLoggedIn(accesstoken !== null);
    setAdmin(role === 'admin');
    setDeleteButton(false);
    axios
    .get(serveraddress+"/api/getallblogs")
    .then((res) => {
      if(res.data.message === "No blogs found"){
        alert("Sorry!" + res.data.message);
      }
      else {
        setBlogs(res.data.results);
      }
    })
    .catch(err => {
      console.error(err);
    });
  }, [accesstoken, role, updated]);
  
  let blogtypesall = ['All','Automotive','Business','DIY','Fashion','Finance','Fitness','Food','Gaming','Lifestyle','Movie','Music','News','Personal', 'Pet', 'Political','Sports','Technology','Travel','Other'];
  let blogtypes = blogtypesall.slice(0, 14);
  let remainingBlogtypes = blogtypesall.slice(14, blogtypesall.length);


  function handleLoginButton(e){
    history.push('/login');
  }

  function handleLogout(e){
    sessionStorage.removeItem("accesstoken");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("userid");
    sessionStorage.removeItem("role");
    setLoggedIn(accesstoken !== null);
    setMyBlogButton(false);
    history.push('/');
  }

  function handleAccountButton(e){
    history.push('/account');
  }
  
  function handleSelectBlogtype(e){
    // console.log(e.target);
    e.preventDefault();
    setRemainingBlogList(false);
    axios
    .post(serveraddress+"/api/getblogwithtype", {type: e.target.name})
    .then((res) => {
      if(res.data.message === "No blogs found for this type"){
        alert("Sorry! " + res.data.message);
      }
      else {
        setBlogs(res.data.results);
        setMyBlogButton(true);
      }
    })
    .catch(err => {
      console.error(err);
    });
  }

  function handleReadBlog(e){
    // console.log(JSON.parse(e.currentTarget.value));
    let blogdata = JSON.parse(e.currentTarget.value);
    history.push('/blog', blogdata);
  }

  function handleExpandClick(e){
    setAnchorEl(e.currentTarget);
    setRemainingBlogList(!remainingBlogList);
  }
  
  function handleMyBlogs(e){
    axios
    .get(serveraddress+"/api/getuserblogs", { headers: {authorization: "Bearer " + accesstoken}})
    .then(res => {
      // console.log(res);
      if(res.data.message === "No blogs found"){
        alert("Sorry! " + res.data.message);
      }
      else {
        setBlogs(res.data.results);
        setMyBlogButton(false);
      }
    })
    .catch(err => {
      console.error(err);
    });
  }
  
  function handleDelete(e){
    // console.log(e.currentTarget);
    let blogdata = JSON.parse(e.currentTarget.value);
    if(e.currentTarget.name === 'soft'){
      axios
      .delete(serveraddress+"/api/softdeleteblog", { headers: {authorization: "Bearer " + accesstoken}, data: blogdata})
      .then(res => {
        // console.log(res);
        alert(res.data.message);
        setUpdated(!updated);
      })
      .catch(err => {
        console.error(err);
      });
    }
    else if(e.currentTarget.name === 'hard'){
      axios
      .delete(serveraddress+"/api/harddeleteblog", { headers: {authorization: "Bearer " + accesstoken}, data: blogdata})
      .then(res => {
        // console.log(res);
        alert(res.data.message);
        setUpdated(!updated);
      })
      .catch(err => {
        console.error(err);
      });
    }
  }

  const remainingtypes = 
    <div>
      <Popper open={remainingBlogList} timeout="auto" unmountOnExit anchorEl={anchorEl}>
        <Paper>
        <List>
          {
            remainingBlogtypes.map(type => {
              return(
              <ListItem key={type}>
                <Link
                  name={type}
                  variant="subtitle1"
                  href={type}
                  onClick={handleSelectBlogtype}
                  className={classes.blogtype}
                >
                  {type}
                </Link>
              </ListItem>
              )
            })
          }
        </List>
        </Paper>
      </Popper>
    </div>

  const loginbutton = <Button className={classes.button} variant="outlined" onClick={handleLoginButton} size="small">Login</Button>
  const accountbutton = 
    <div>
      <Button className={classes.accountbutton} onClick={handleAccountButton} size="small">{name}</Button>
      <Button className={classes.button} variant="outlined" onClick={handleLogout} size="small">Logout</Button>
    </div>

  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>      
        { admin ? '' :
        <div>
          {myBlogButton ? <Button className={classes.button} onClick={handleMyBlogs} size="small">My Blogs</Button> : ''}
          <Button className={classes.button} onClick={() => history.push('/newblog', {editing: false})} size="small">Create Blog</Button>
        </div>
        }
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
              key={type}
              name={type}
              variant="subtitle1"
              href={type}
              onClick={handleSelectBlogtype}
              className={classes.blogtype}
            >
              {type}
            </Link>
          ))
        }
        <IconButton onClick={handleExpandClick}>
          {remainingBlogList ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        {remainingtypes}
      </Toolbar>
      <Container className={classes.cardstack}>
        {
          blogs.map(blog => (
            <Card className={classes.card} key={blog.title}>
            <div  style={{height: 300, verticalAlign: 'top'}}>
              <CardActionArea>
                <CardMedia
                  className={classes.image}
                  image={blog.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {blog.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              </div>
              <CardActions>
                {
                  deleteButton ?
                  <div>
                    <Button size="small" className={classes.cardbutton} onClick={handleDelete} name='soft' value={JSON.stringify(blog)}>Soft Delete</Button>
                    <Button size="small" className={classes.cardbutton} onClick={handleDelete} name='hard' value={JSON.stringify(blog)}>Hard Delete</Button>
                    <Button size="small" className={classes.cardbutton} onClick={() => setDeleteButton(false)}>Cancel</Button>
                  </div>
                  :
                  <div>
                    <Button size="small" className={classes.cardbutton} onClick={handleReadBlog} value={JSON.stringify(blog)}>
                      Read More
                    </Button>
                    {admin ? <Button size="small" className={classes.cardbutton} onClick={() => setDeleteButton(true)}>
                      Delete
                    </Button> : ''}
                  </div>
                }
              </CardActions>
            </Card>
          ))
        }
      </Container>
    </Fragment>
  );
}
