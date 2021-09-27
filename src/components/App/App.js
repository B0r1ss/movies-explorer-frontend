import React from 'react'; 
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import Register from '../Register/Register';
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import Movies from '../Movies/Movies';
import SearchForm from '../SearchForm/SearchForm';

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route exect path={'/'}>
        <Main />
        </Route>
      </Switch>
      <Movies />
      <Register />
      <Login />
      <Footer />
      <Profile />
      <SearchForm/>
    </div>
  );
}
