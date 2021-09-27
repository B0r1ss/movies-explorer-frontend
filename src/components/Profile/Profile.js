import React from "react";

import Header from "../Header/Header";

export default function Profile(props) {


    return (
        <>
            <Header loggedIn={props.loggedIn} main={false}/>
            <section className="profile">
                <h2 className="profile__title">Привет, currentUser.name!</h2>
                <form className="profile__form" >
                    <fieldset className="profile__fields">
                        <div className="profile__form-input">
                            <p className="profile__form-input-name">Имя</p>
                            <input type="text" name="name" pattern="[а-яА-Яa-zA-ZёË\- ]{1,}" className="profile__form-input-field"


                                   required />
                        </div>
                        <span className="profile__input-error"></span>
                        <div className="profile__form-input">
                            <p className="profile__form-input-name">Email</p>
                            <input type="email" name="email" className="profile__form-input-field"


                                   required />
                        </div>
                        <span className="profile__input-error"></span>
                    </fieldset>
                    <span
                        className={`profile__form-message ${props.isUpdateSuccess ? 'profile__form-message_type_success' : 'profile__form-message_type_error'}`}>
                        {props.message}</span>
                    {true ? <button className="profile__button profile__button_type_edit" >Редактировать</button> :
                        <button type="submit" 
                                className={`profile__button profile__button_type_save ${true ? '' : 'profile__button_type_save_disabled'}`}>
                            Сохранить</button>}
                </form>
                <button className={true ? 'profile__signout-link' : 'profile__signout-link no-display'}
                        onClick={props.onSignOut}>Выйти из аккаунта</button>
            </section>
        </>

    )
}