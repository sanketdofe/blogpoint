import React, { Fragment , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "65%",
        padding: "10px",
        margin: 'auto'
    },
    heading: {
        color: '#34656d'
    },
    card: {
        padding:'20px',
        width: '100%'
    },
    button: {
        backgroundColor: '#34656d',
        color: "#FFFFFF",
        margin: '0 5px'
    },
    image: {
        height: 400,
    },
    blogtypeheading: {
        color: '#34656d',
        textAlign: 'center'
    },
    displaylinebreak: {
        whiteSpace: 'pre-line'
    }
    }));

export default function ViewBlog(props) {
    // console.log(props);
    const classes = useStyles();
    const history = useHistory();

    let accesstoken = sessionStorage.getItem("accesstoken");
    const [loggedIn, setLoggedIn] = React.useState(accesstoken !== null);
    const [blog, setBlog] = React.useState({
        title: '',
        type: '',
        description: '',
        body: '',
        image: '',
        created_at: '',
        blogid: '',
        userid: '',
        authorname: ''
    });
    useEffect(() => {
        setLoggedIn(accesstoken !== null);
        if(!loggedIn){
            alert("Please login first");
            history.push("/login");
        }
        else{
            setBlog(props.location.state);
            // console.log(props.location.state);
        }
    }, [loggedIn, history, accesstoken, props.location.state]);

    
    return (
        <Fragment>
        <div className={classes.root}>
            <Card className={classes.card}>
                <Typography className={classes.blogtypeheading} gutterBottom variant="h3" component="h2">
                    {`${blog.type} blog on '${blog.title}'`}
                </Typography>
                <Divider style={{margin:'10px 0'}}/>
                <CardMedia
                    component="img"
                    className={classes.image}
                    image={blog.image}
                    src={blog.image}
                />
                <CardContent>
                <Typography className={classes.heading} gutterBottom variant="h3" component="h2">
                    {blog.title}
                </Typography>
                <Typography variant="h5" gutterBottom color="textPrimary" component="p">
                    {blog.description}
                </Typography>
                <Divider style={{margin:'10px 0'}}/>
                <Typography className={classes.displaylinebreak} variant="h6" color="textSecondary" component="h6">
                    {blog.body}
                </Typography>
                <Divider style={{margin:'10px 0'}}/>
                <Typography style={{textAlign: 'right'}} variant="h6" color="textPrimary" component="p">
                    {`Written by ${blog.authorname} on ${blog.created_at.substr(0, 10)}`}
                </Typography>
                </CardContent>
                <div style={{textAlign: 'center'}}>
                    {parseInt(blog.userid) === parseInt(sessionStorage.getItem("userid")) ? <Button className={classes.button} >Edit</Button> : ''}
                    <Button className={classes.button} onClick={() => history.push('/')}>Go Home</Button>
                </div>
            </Card>
        </div>
        </Fragment>
    );
}
