import React from "react";
import logo from "../../images/header-logo.svg";
import Navigation from "../Navigation/Navigation";

export default function Header(props) {

  return (
    <header className={
      props.main
      ? "header"
      : "header header_type_white"}>
      <img src={logo} className="header__logo" alt="Лого"/>
      <Navigation />
    </header>
  );
}
