import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import AddBlog from './AddBlog';
import Useraccount from './Useraccount';
import ViewBlog from './ViewBlog';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/newblog" component={AddBlog} />
          <Route exact path="/account" component={Useraccount} />
          <Route exact path="/blog" component={ViewBlog} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
