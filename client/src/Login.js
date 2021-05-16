import React, { useEffect } from "react";
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
    switchbutton: {
        color: "#34656d",
        fontWeight: 600,
        fontSize: '18px',
        margin: '0 30px'
    },
    formControl: {
        width: '90%',
    },
    button: {
        margin: '20px 15px',
        color: "#34656d",
        fontWeight: 600,
    },
    textfield: {
        fontColor:"#34656d",
        margin: "3px 0"
    }
  }));
export default function Login(props) {
    let accesstoken = sessionStorage.getItem("accesstoken");
    const [loggedIn, setLoggedIn] = React.useState(accesstoken !== null);
    const [tabactive, setTabactive] = React.useState(true);
    const [state, setState] = React.useState({
        name: "",
        email: "",
        password: "",
        reenteredpassword: "",
        role: (props.location.pathname === '/manage' ? 'admin' : 'user')
    });
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        setLoggedIn(accesstoken !== null);
        if(loggedIn){
            alert('You are already Logged In');
            history.push('/');
        }
        setState({
            name: "",
            email: "",
            password: "",
            reenteredpassword: "",
            role: (props.location.pathname === '/manage' ? 'admin' : 'user')
        });
    }, [props.location.pathname]);

    function handleChange(event){
        // console.log(event.target.value)
        setState({ ...state, [event.target.name]: event.target.value});
    };
    
    function handleReset(){
        setState({ 
            ...state,
            name: "",
            email: "",
            password: "",
            reenteredpassword: ""
        });
    };

    function handleRegister(e){
        e.preventDefault();
        // console.log(state);
        for(var item in state){
            if(state[item] === ''){
                alert(item + " cannot be empty");
                handleReset();
                return;
            }
        }
        if( state.password !== state.reenteredpassword){
            alert("Both Passwords are not identical. Please try again.");
            handleReset();
            return;
        }
        axios
        .post(serveraddress+"/api/adduser", state)
        .then((res) => {
            if(res.data.message === "User with same email already exists"){
                alert(res.data.message);
                handleReset();
            }
            else if(res.data.message === "User Added Successfully"){
                alert(res.data.message);
                setTabactive(true);
                handleReset();
            }
          })
          .catch(err => {
            console.error(err);
          });
    }

    function handleLogin(e){
        e.preventDefault();
        // console.log(state);
        if(state.email === '' || state.password === ''){
            alert("Enter both Email and Password");
            handleReset();
            return;
        }
        let data = {
            email: state.email,
            password: state.password,
            role: state.role
        }
        axios
        .post(serveraddress+"/api/authenticate", data)
        .then((res) => {
            // console.log(res);
            if(res.data.message === "Your role does not qualify"){
                if(state.role === "admin"){
                    alert("You are not an admin, please login here as user");
                    handleReset();
                    history.push('/login');
                }
                else{
                    alert("You are an admin, please login here again");
                    handleReset();
                    history.push('/manage');
                }
            }
            else if(res.data.message === "No such User found. Please Register"){
                alert(res.data.message);
                setTabactive(false);
            }
            else if(res.data.message === "Wrong Password"){
                alert(res.data.message);
                handleReset();
            }
            else if(res.data.message === "Authentication Success"){
                sessionStorage.setItem("accesstoken", res.data.accesstoken);
                sessionStorage.setItem("name", res.data.name);
                sessionStorage.setItem("userid", res.data.userid);
                sessionStorage.setItem("role", res.data.role);
                history.push('/');
            }
          })
          .catch(err => {
            console.error(err);
          });
    }

    const RegisterForm = (
        <div>
            <FormControl required component="fieldset" className={classes.formControl}>
                <TextField className={classes.textfield} value={state.name} onChange={handleChange} required name="name" label="Name" />
                <TextField className={classes.textfield} value={state.email} onChange={handleChange} required type="email" name="email" label="Email" />
                <TextField className={classes.textfield} value={state.password} onChange={handleChange} required type="password" name="password" label="Password" />
                <TextField className={classes.textfield} value={state.reenteredpassword} onChange={handleChange} required type="password" name="reenteredpassword" label="Reenter Password" />
                <div>
                    <Button size="small" variant='outlined' onClick={handleRegister} className={classes.button} style={{backgroundColor: '#34656d',color: "#FFFFFF"}}>Sign Up</Button>
                    <Button size="small" variant='outlined' onClick={handleReset} className={classes.button} >Reset</Button>
                </div>
            </FormControl>
        </div>
        
    );

    const LoginForm = (
        <div>
            <FormControl required component="fieldset" className={classes.formControl}>
                <TextField className={classes.textfield} value={state.email} onChange={handleChange} required type="email" name="email" label="Email" />
                <TextField className={classes.textfield} value={state.password} onChange={handleChange} required type="password" name="password" label="Password" />
                <div>
                    <Button size="small" variant='outlined' onClick={handleLogin} className={classes.button} style={{backgroundColor: '#34656d',color: "#FFFFFF"}}>Login</Button>
                    <Button size="small" variant='outlined' className={classes.button} >Forgot Password</Button>
                </div>
            </FormControl>
        </div>
    );
    
    return (
        <>
        {
        !loggedIn ? 
        <div className={classes.root}>
            <Card style={{padding: '20px'}}>
                <div style={{textAlign: 'center'}}>
                    <h2 style={{textTransform:'uppercase', color: '#34656d'}}>{state.role}</h2>
                    <hr />
                    <Button size="large" className={classes.switchbutton} onClick={() =>setTabactive(true)} disabled={tabactive}>Login</Button>
                    <Button size="large" className={classes.switchbutton} onClick={() => setTabactive(false)} disabled={!tabactive}>Register</Button>
                    <hr />
                    {tabactive ? LoginForm : RegisterForm}
                </div>
            </Card>
        </div>
        : ''
        }
        </>
    );
}
