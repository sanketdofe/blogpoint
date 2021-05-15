import React, { Fragment , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

let serveraddress = "http://localhost:5000";
const useStyles = makeStyles((theme) => ({
    root: {
        width: "70%",
        padding: "10px",
        margin: 'auto'
    },
    formControl: {
        margin: theme.spacing(5),
        width: '90%',
        justifyContent: 'center'
    },
    heading: {
        color: '#34656d', 
        textAlign: 'center'
    },
    card: {
        padding:'20px',
        width: '100%'
    },
    textfield: {
        margin: '10px 0'
    },
    button: {
        backgroundColor: '#34656d',
        color: "#FFFFFF",
        margin: '0 5px'
    },
    divbutton: {
        textAlign: 'center'
    }
    }));

    export default function AddBlog() {
    const classes = useStyles();
    const history = useHistory();

    let accesstoken = sessionStorage.getItem("accesstoken");
    const [loggedIn, setLoggedIn] = React.useState(accesstoken !== null);
    const [blog, setBlog] = React.useState({
        title: '',
        topic: '',
        description: '',
        body: '',
        image: ''
    });
    useEffect(() => {
        setLoggedIn(accesstoken !== null);
        if(!loggedIn){
            alert("Please login first");
            history.push("/login")
        }
    }, [loggedIn, history, accesstoken]);

    let types = ['Fashion', 'Food', 'Travel', 'Music', 'Lifestyle', 'Fitness', 'DIY', 'Sports', 'Finance', 'Political', 'Business', 'Personal', 'Movie', 'Automotive', 'News', 'Pet', 'Gaming', 'Technology', 'Other'];
    
    function handleChange(e){
        // console.log(e.target);
        setBlog({ ...blog, [e.target.name]: e.target.value});
        // console.log(blog);
    }
    
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });
      }

    async function handleImage(e){
        // console.log(e.target.files[0]);
        setBlog({ ...blog, image: await convertFileToBase64(e.target.files[0])});
    }

    function handleReset(){
        setBlog({
            title: '',
            topic: '',
            description: '',
            body: '',
            image: ''
        });
    }

    function handleSubmit(e){
        e.preventDefault();
        // console.log(blog);
        for(var item in blog){
            if(blog[item] === '' && item !== 'image'){
                alert(item + " cannot be empty");
                return;
            }
        }
        axios.post(serveraddress+"/api/addblog", blog, { headers: {authorization: "Bearer " + accesstoken}})
        .then(res => {
            // console.log(res);
            if(res.data.message === 'A blog with same title already exists'){
                alert(res.data.message);
            }
            else if(res.data.message === 'Blog added successfully'){
                alert(res.data.message);
                history.push('/');
            }
        })
        .catch(err => {console.error(err)});
    }
    
    return (
        <Fragment>
        <div className={classes.root}>
            <Card className={classes.card}>
                <h1 className={classes.heading}>Create A Blog</h1>
                <FormControl required component="fieldset" className={classes.formControl}>
                <InputLabel id="select-type">Type of Blog</InputLabel>
                <Select
                    labelId="select-type"
                    id="select-type"
                    name="topic"
                    onChange={handleChange}
                    value={blog.topic}
                    className={classes.textfield}
                >
                    {types.map(type => {
                        return <MenuItem key={type} value={type}>{type}</MenuItem>
                    })}
                </Select>
                <TextField className={classes.textfield} value={blog.title} onChange={handleChange} required name="title" label="Title" />
                <TextField className={classes.textfield} value={blog.description} onChange={handleChange} required name="description" label="Short Description" />
                <TextField
                    label="Body"
                    multiline
                    className={classes.textfield}
                    required
                    value={blog.body}
                    name='body'
                    onChange={handleChange}
                />
                <input
                    id="uploadimage"
                    type="file"
                    files={blog.image}
                    accept="image/*"
                    name='image'
                    hidden
                    onChange={handleImage}
                />
                <label htmlFor="uploadimage" className={classes.textfield}>
                    <p style={{display: "inline"}}>Upload An Image for this Blog:</p>
                    <IconButton color="primary" component="span">
                        <CloudUploadOutlinedIcon style={{fontSize:"40px", color: '#34656d'}}/>
                    </IconButton>
                </label>
                </FormControl>
                <div className={classes.divbutton}>
                    <Button className={classes.button} onClick={handleSubmit}>Submit</Button>
                    <Button className={classes.button} onClick={handleReset}>Reset</Button>
                </div>
            </Card>
        </div>
        </Fragment>
    );
}
