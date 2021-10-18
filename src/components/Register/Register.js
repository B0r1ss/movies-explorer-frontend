import React from "react";
import { Link, withRouter } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import logo from "../../images/header-logo.svg";

import { useFormWithValidation } from "../../hooks/useForm";

function Register() {
  const { values, handleChange, errors, isFormValid } = useFormWithValidation();
  const appContext = React.useContext(AppContext);


  function handleRegister(evt) {
    evt.preventDefault();
    appContext.onRegister(values.name, values.password, values.email);
    appContext.onClear();
  }

  return (
    <>
      <section className="register">
      <Link to="/" className="login__image"><img src={logo} alt="Logo"/></Link>
        <h2 className="register__title auth__title">Добро пожаловать!</h2>
        <form className="register__form auth__form" onSubmit={handleRegister}>
          <fieldset className="register__fields auth__fields">
            <p className="register__input-name auth__input-name">Имя</p>
            <input
              type="text"
              name="name"
              pattern="[а-яА-Яa-zA-ZёË\- ]{1,}"
              className="register__input auth__input"
              value={values.name || ""}
              onChange={handleChange}
              required
              disabled={appContext.isSaving}
            />
            <span className="register__error auth__error">{errors.name}</span>
            <p className="register__input-name auth__input-name">E-mail</p>
            <input
              type="email"
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className="register__input auth__input"
              value={values.email || ""}
              onChange={handleChange}
              required
              disabled={appContext.isSaving}
            />
            <span className="register__error auth__error">{errors.email}</span>
            <p className="register__input-name auth__input-name">Пароль</p>
            <input
              type="password"
              name="password"
              className="register__input auth__input"
              value={values.password || ""}
              onChange={handleChange}
              required
              minLength="8"
              disabled={appContext.isSaving}
            />
            <span className="register__error auth__error">
              {errors.password}
            </span>
          </fieldset>
          <span className="register__submit-error auth__submit-error">
            {appContext.signupErrorMessage}
          </span>
          <button
            disabled={!isFormValid}
            type="submit"
            className={`register__submit-button auth__submit-button ${
              isFormValid ? "" : "auth__submit-button_disabled"
            }`}
          >
            Зарегистрироваться
          </button>
        </form>
        <h3 className="register__subtitle auth__subtitle">
          Уже зарегистрированы?
          <Link
            className="register__link auth__link"
            to="/signin"
            onClick={appContext.onClear}
          >
            {" "}
            Войти
          </Link>
        </h3>
      </section>
    </>
  );
}

export default withRouter(Register);
