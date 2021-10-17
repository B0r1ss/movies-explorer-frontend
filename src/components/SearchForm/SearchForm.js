import React from "react";
import { AppContext } from "../../context/appContext";
import search__icon from "../../images/search__icon.svg";

export default function SearchForm(props) {
  const appContext = React.useContext(AppContext);
  const [isSearchValid, setIsSearchValid] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState("");

  function handleChangeSearch(evt) {
    setSearchValue(evt.target.value);
  }

  function handleSearchMovies(evt) {
    evt.preventDefault();
    setIsSearchValid(Boolean(searchValue));
    switch (props.saved) {
      case true:
        appContext.onSearchSavedMovies(searchValue);
        break;
      case false:
        appContext.onSearchMovies(searchValue);
        break;
      default:
    }
  }

  return (
    <div className="search">
      <form className='search-form' onSubmit={handleSearchMovies}>
        <img src={search__icon} alt='Поиск' className='search__icon' />
        <div className='search__form-field'>
          <input
            name="search__input"
            type="text"
            value={searchValue || ""}
            minLength="1"
            maxLength="200"
            onChange={handleChangeSearch}
            className='search-form__input'
            placeholder='Фильм'
          ></input>
          <span
            className={`search__form-error ${
              isSearchValid ? "search__form-error_hidden" : ""
            }`}
          >
            Нужно ввести ключевое слово
          </span>
        </div>
        <button className='search-form__button' type='submit'>
          Найти
        </button>
        <div className='search-form__checkbox'>
          <div className='search-form__vl'>
            <label className='search-form__switch'>
              <input type='checkbox' onChange={appContext.onShortMoviesCheck} />
              <span className='slider round'></span>
            </label>
          </div>
          <p className='search-form__text'>Короткометражки</p>
        </div>
      </form>
    </div>
  );
}
