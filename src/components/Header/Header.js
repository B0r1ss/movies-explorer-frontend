import React from "react";
import logo from "../../images/header-logo.svg";
import Navigation from "../Navigation/Navigation";
import {Link} from "react-router-dom";

export default function Header(props) {

  return (
    <header className={
      props.main
      ? "header"
      : "header header_type_white"}>
      <Link className="header__logo" to="/"><img src={logo} alt="Лого"/></Link>
      <Navigation />
    </header>
  );
}
