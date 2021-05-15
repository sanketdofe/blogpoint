import React, {useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

let serveraddress = "http://localhost:5000";
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        margin: '10% 0'
    },
    formControl: {
        width: '100%',
    },
    button: {
        margin: '20px 10px',
        color: "#34656d",
        fontWeight: 600,
    },
    textfield: {
        fontColor:"#34656d",
        margin: "3px 0",
        width: "90%"
    },
    heading: {
        color: '#34656d', 
        textAlign: 'center'
    }
  }));
export default function Useraccount() {
    let accesstoken = sessionStorage.getItem("accesstoken");
    const [loggedIn, setLoggedIn] = React.useState(accesstoken !== null);
    const [viewing, setViewing] = React.useState(true);
    const [updatepassword, setUpdatepassword] = React.useState(false);
    const [user, setUser] = React.useState({
        name: "",
        email: "",
        password: "",
        newpassword: "",
        reenterednewpassword: ""
    });
    const classes = useStyles();
    const history = useHistory();
    useEffect(() => {
        setLoggedIn(accesstoken !== null);
        if(!loggedIn){
            alert("Please login again");
            history.push("/login");
        }
        axios.get(serveraddress+"/api/getuser", { headers: {authorization: "Bearer " + accesstoken}})
        .then(res => {
            if(res.data.message === 'jwt expired'){
                setLoggedIn(false);
                sessionStorage.removeItem("accesstoken");
                sessionStorage.removeItem("name");
                history.push('/login');
            }else{
                setUser({
                    email: res.data.email, 
                    name: res.data.name,
                    password: "",
                    newpassword: "",
                    reenterednewpassword: ""
                });
            }
        })
        .catch(err => {console.error(err)});
    }, [accesstoken, loggedIn, history]);

    function handleChange(event){
        console.log(user);
        setUser({ ...user, [event.target.name]: event.target.value});
    };
    
    function handleUpdate(e){
        e.preventDefault();
        if(user.email === ''){
            alert("Email cannot be empty");
        }
        else if(user.name === ''){
            alert("Name cannot be empty");
        }
        else{
            axios.post(serveraddress+"/api/updateuser", {email: user.email, name: user.name}, { headers: {authorization: "Bearer " + accesstoken}})
            .then(res => {
                // console.log(res);
                if(res.data.message === 'Update Successful'){
                    alert(res.data.message);
                    history.push('/');
                }else if(res.data.message === 'jwt expired'){
                    sessionStorage.removeItem("accesstoken");
                    sessionStorage.removeItem("name");
                    setLoggedIn(false);
                }
            })
            .catch(err => {console.error(err)});
        }
    };
    function handleUpdatePassword(e){
        e.preventDefault();
        if(user.password === '' || user.newpassword === '' || user.reenterednewpassword === ''){
            alert("Fields cannot be empty");
        }
        else if(user.newpassword !== user.reenterednewpassword){
            alert("Both Passwords should be same. Please try again.");
            setUser({
                ...user,
                password: "",
                newpassword: "",
                reenterednewpassword: ""
            });
            return;
        }
        else{
            axios.post(serveraddress+"/api/updatepassword", {oldpassword: user.password, newpassword: user.newpassword}, { headers: {authorization: "Bearer " + accesstoken}})
            .then(res => {
                // console.log(res);
                if(res.data.message === 'Current password Incorrect'){
                    alert(res.data.message);
                    setUser({
                        ...user,
                        password: "",
                        newpassword: "",
                        reenterednewpassword: ""
                    });
                    return;
                }
                else if(res.data.message === 'Password updated successfully'){
                    alert(res.data.message);
                    history.push('/');
                }
                else if(res.data.message === 'jwt expired'){
                    sessionStorage.removeItem("accesstoken");
                    sessionStorage.removeItem("name");
                    setLoggedIn(false);
                }
            })
            .catch(err => {console.error(err)});
        }
    };

    const nameemail = 
        <div>
            <TextField disabled={viewing} className={classes.textfield} value={user.name} onChange={handleChange} required name="name" label="Name" />
            <TextField disabled={viewing} className={classes.textfield} value={user.email} onChange={handleChange} required type="email" name="email" label="Email" />
        </div>

    const updatepassworddata = 
        <div>
            <TextField className={classes.textfield} value={user.password} onChange={handleChange} required type="password" name="password" label="Current Password" />
            <TextField className={classes.textfield} value={user.newpassword} onChange={handleChange} required type="password" name="newpassword" label="New Password" />
            <TextField className={classes.textfield} value={user.reenterednewpassword} onChange={handleChange} required type="password" name="reenterednewpassword" label="Reenter New Password" />
        </div>

    const viewinguserbutton = 
        <div>
            <Button size="small" variant='outlined' onClick={() => setViewing(false)} className={classes.button} style={{backgroundColor: '#34656d',color: "#FFFFFF"}}>Edit</Button>
            <Button size="small" variant='outlined' onClick={() => history.push('/')} className={classes.button} style={{backgroundColor: '#34656d',color: "#FFFFFF"}}>Go Home</Button>
        </div>
    
    const editinguserbutton = 
        <div>
            <Button size="small" variant='outlined' onClick={handleUpdate} className={classes.button} style={{backgroundColor: '#34656d',color: "#FFFFFF"}}>Update</Button>
            <Button size="small" variant='outlined' onClick={() => setUpdatepassword(true)} className={classes.button} style={{backgroundColor: '#34656d',color: "#FFFFFF"}}>Update Password</Button>
            <Button size="small" variant='outlined' onClick={() => {setViewing(true); setUpdatepassword(false)}} className={classes.button} style={{backgroundColor: '#34656d',color: "#FFFFFF"}}>Cancel</Button>
        </div>

    const passwordupdatebutton = 
        <div>
            <Button size="small" variant='outlined' onClick={handleUpdatePassword} className={classes.button} style={{backgroundColor: '#34656d',color: "#FFFFFF"}}>Update</Button>
            <Button size="small" variant='outlined' onClick={() => {setUpdatepassword(false)}} className={classes.button} style={{backgroundColor: '#34656d',color: "#FFFFFF"}}>Cancel</Button>
        </div>
    
    return (
        <div className={classes.root}>
            <Card style={{padding: '20px'}}>
                <h1 className={classes.heading}>{user.name}'s Profile</h1>
                <div style={{textAlign: 'center'}}>
                    <FormControl required component="fieldset" className={classes.formControl}>
                        {updatepassword ? updatepassworddata: nameemail}
                        {viewing ? viewinguserbutton : (updatepassword ? passwordupdatebutton : editinguserbutton)}
                    </FormControl>
                </div>
            </Card>
        </div>
    );
}
