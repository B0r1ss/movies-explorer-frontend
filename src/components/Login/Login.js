import { Link } from "react-router-dom";
import React from "react";
import { AppContext } from "../../context/appContext";
import { useFormWithValidation } from "../../hooks/useForm";
import logo from "../../images/header-logo.svg";

export default function Login() {
  const { values, handleChange, errors, isFormValid } = useFormWithValidation();
  const appContext = React.useContext(AppContext);

  function handleLogin(evt) {
    evt.preventDefault();
    appContext.onLogin(values.password, values.email);
    appContext.onClear();
  }

  return (
    <section className="login ">
      <Link to="/" className="login__image"><img src={logo} alt="Logo" /></Link>
      <h2 className="login__title auth__title">Рады видеть!</h2>
      <form className="login__form auth__form" onSubmit={handleLogin}>
        <fieldset className="login__fields auth__fields">
          <p className="login__input-name auth__input-name">E-mail</p>
          <input
            type="email"
            name="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            className="login__input auth__input"
            value={values.email || ""}
            onChange={handleChange}
            required
            disabled={appContext.isSaving}
          />
          <span className="login__error auth__error">{errors.email}</span>
          <p className="login__input-name auth__input-name">Пароль</p>
          <input
            type="password"
            name="password"
            className="login__input auth__input"
            value={values.password || ""}
            onChange={handleChange}
            required
            minLength="8"
            disabled={appContext.isSaving}
          />
          <span className="login__error auth__error">{errors.password}</span>
        </fieldset>
        <span className="login__submit-error auth__submit-error">
          {appContext.signinErrorMessage}
        </span>
        <button
          type="submit"
          disabled={!isFormValid}
          className={`login__submit-button auth__submit-button ${
            isFormValid ? "" : "auth__submit-button_disabled"
          }`}
        >
          Войти
        </button>
      </form>
      <h3 className="login__subtitle auth__subtitle">
        Ещё не зарегистрированы?
        <Link
          className="login__link auth__link"
          to="/signup"
          onClick={appContext.onClear}
        >
          Регистрация
        </Link>
      </h3>
    </section>
  );
}
