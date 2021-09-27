import React from "react";
import { Link } from "react-router-dom";

export default function Register(props) {

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleChangeName(evt) {
    setName(evt.target.value)
  }

  function handleChangeEmail(evt) {
    setEmail(evt.target.value)
  }

  function handleChangePassword(evt) {
    setPassword(evt.target.value)
  }

  function handleRegister(evt) {
    evt.preventDefault()
    props.onRegister({
      
    })
  }

  return (
    <section className="register">
        <h2 className="register__title">Добро пожаловать!</h2>
        <form className="register__form auth__form" onSubmit={handleRegister}>
            <fieldset className="register__fields auth__fields">
                <label className="register__label-name auth__input-name" for="register__name">Имя</label>
                <input 
                id="register__name"
                type="text"
                name="name"
                pattern="[а-яА-Яa-zA-ZёË\- ]{1,}"
                className="register__input auth__input"
                value={name || ''} onChange={handleChangeName}
                required
                disabled={false}
                />
                <span className="register__error auth__error">{}</span>
                <label className="register__label-name auth__input-name" for="register__email">E-mail</label>
                <input
                id="register__email"
                type="email"
                name="email"
                className="register__input auth__input"
                value={email || ''} onChange={handleChangeEmail}
                required
                disabled={false}
                />
                <span className="register__error auth__error">{}</span>
                <label for="register__pass" className="register__label-name auth__input-name" for="register__email">Пароль</label>
                <input
                id="register__pass"
                type="password"
                name="password"
                className="register__input auth__input"
                value={password || ''}
                onChange={handleChangePassword}
                required
                minLength="8"
                disabled={props.isSaving}
                />
                <span className="register__error auth__error">{}</span>
            </fieldset>
            <span className="register__submit-error auth__submit-error">{props.errorMessage}</span>
            <button
            disabled={true}
            type="submit"
            className={`register__submit-button auth__submit-button ${ 'auth__submit-button_disabled'}`}>
              Зарегистрироваться</button>
        </form>
            <h3 className="register__subtitle auth__subtitle">
              Уже зарегистрированы?<Link className="register__link auth__link" to="/signin" onClick={props.onClear}> Войти</Link>
            </h3>
    </section>
  )
}