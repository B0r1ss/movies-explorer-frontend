import React from "react";
import { CurrentUserContext } from "../../context/currentUserContext";
import { AppContext } from "../../context/appContext";
import { useFormWithValidation } from "../../hooks/useForm";
import Header from "../Header/Header";

export default function Profile() {
  const { values, setValues, handleChange, errors, isFormValid } =
    useFormWithValidation();
  const [isFormDisabled, setIsFormDisabled] = React.useState(false);

  const currentUserContext = React.useContext(CurrentUserContext);
  const appContext = React.useContext(AppContext);

  React.useEffect(() => {
    setValues(currentUserContext.currentUser);
  }, [currentUserContext.currentUser, setValues]);

  React.useEffect(() => {
    setIsFormDisabled(appContext.inProgressUpdate);
  }, [appContext.inProgressUpdate, appContext.onEditUserInfo]);

  React.useEffect(() => {
    setIsFormDisabled(false);
  }, []);

  function handleEditProfileClick(evt) {
    evt.preventDefault();
    setIsFormDisabled(false);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    appContext.onEditUserInfo(values.name, values.email);
  }



  return (
    <>
      <Header main={false} />
      <section className='profile'>
        <h2 className='profile__title'>
          Привет, {currentUserContext.currentUser.name}!
        </h2>
        <form className='profile__form' onSubmit={handleSubmit}>
          <fieldset className='profile__fields'>
            <div className='profile__form-input'>
              <p className='profile__form-input-name'>Имя</p>
              <input
                type='text'
                name='name'
                pattern='[а-яА-Яa-zA-ZёË\- ]{1,}'
                className='profile__form-input-field'
                value={values.name || ""}
                onChange={handleChange}
                disabled={isFormDisabled}
                required
              />
            </div>
            <span className='profile__input-error'>{errors.name}</span>
            <div className='profile__form-input'>
              <p className='profile__form-input-name'>Email</p>
              <input
                type='email'
                name='email'
                className='profile__form-input-field'
                value={values.email || ""}
                onChange={handleChange}
                disabled={isFormDisabled}
                required
              />
            </div>
            <span className='profile__input-error'>{errors.email}</span>
          </fieldset>
          <span
            className={`profile__form-message ${
              appContext.isUpdateSuccess
                ? "profile__form-message_type_success"
                : "profile__form-message_type_error"
            }`}
          >
            {appContext.editProfileErrorMessage}
          </span>
          {isFormDisabled ? (
            <button
              className='profile__button profile__button_type_edit'
              onClick={handleEditProfileClick}
            >
              Редактировать
            </button>
          ) : (
            <button
              type='submit'
              disabled={!isFormValid}
              className={`profile__button profile__button_type_save ${
                isFormValid ? "" : "profile__button_type_save_disabled"
              }`}
            >
              Сохранить
            </button>
          )}
        </form>
        <button
          className={
            isFormDisabled
              ? "profile__signout-link"
              : "profile__signout-link no-display"
          }
          onClick={appContext.onSignOut}
        >
          Выйти из аккаунта
        </button>
      </section>
    </>
  );
}
