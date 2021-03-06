import {Link} from "react-router-dom";
import React from "react";
import { AppContext } from "../../context/appContext";
import accButton from "../../images/account__button.svg"

export default function Navigation() {
    const [isMenuShown, setIsMenuShown] = React.useState(false);
    const appContext = React.useContext(AppContext)


    function handleCloseMenuButtonClick() {
        setIsMenuShown(false);
    }

    function handleOpenMenuButtonClick() {
        setIsMenuShown(true);
    }
    return (
        <div className={appContext.loggedIn
        ? 'header__navigation'
        : 'header__navigation header__navigation_right'}>
          <div
          className={appContext.loggedIn ? '' : 'none-display'}>
              <Link
              to="/movies"
              className="header__link header__movies"
              >Фильмы</Link>
              <Link
              to="/saved-movies"
              className="header__link header__movies"
              >Сохранённые фильмы</Link>
          </div>

            <div className="header__login-navigation">
              <Link
              to="/signup"
              className={appContext.loggedIn
                ? 'header__link header__register none-display' :
                  'header__link header__register'}
                  >Регистрация</Link>
              {appContext.loggedIn 
              ? <Link
                to="/profile" className="header__link header__account">Аккаунт <img src={accButton} alt="Аккаунт" className="header__account_img"/></Link>
              : <Link
                to="/signin"
                className="header__link header__login"
                >Войти</Link>}
            </div>

            <button
            className={
              appContext.loggedIn
              ? 'header__burger-button'
              : 'header__burger-button none-display'
              } onClick={handleOpenMenuButtonClick}></button>
            <div className={
              isMenuShown 
              ? 'header__burger-menu visible' 
              : 'header__burger-menu'}>
                <button className="header__burger-menu-close-button" onClick={handleCloseMenuButtonClick}></button>
                <div className={isMenuShown 
                  ? 'header__burger-menu-container visible' 
                  : 'header__burger-menu-container'}>
                    <div className="header__burger-menu-links">
                        <Link to="/" className="header__burger-menu-link">Главная</Link>
                        <Link to="/movies" className="header__burger-menu-link">Фильмы</Link>
                        <Link to="/saved-movies" className="header__burger-menu-link">Сохранённые фильмы</Link>
                        <Link to="/profile" className="header__burger-menu-link header__burger-menu-link_type_account">Аккаунт</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
