import React from 'react'; 
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Main from '../Main/Main';
import Footer from '../Footer/Footer';

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route exect path={'/'}>
        <Main />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}
