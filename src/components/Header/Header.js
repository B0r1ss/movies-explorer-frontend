import React from "react";
import logo from "../../images/header-logo.svg";
import Navigation from "../Navigation/Navigation";
import {Link} from "react-router-dom";
import { AppContext } from "../../context/appContext";

export default function Header(props) {

  const appContext = React.useContext(AppContext)
  return (
    <header className={
      props.main
      ? "header"
      : "header header_type_white"}>
       { appContext.loggedIn
       ? <Link className="header__logo" to="/"><img src={logo} alt="Лого"/></Link>
       : <img src={logo} alt="Лого" className="header__logo"/>
      }
      <Navigation />
    </header>
  );
}
