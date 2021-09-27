export default function SearchForm() {
  return (
    <form className="search-form">
      <input className="search-form__input"></input>
      <button className="search-form__button">Найти</button>
      <div className="search-form__vl">
        <label className="search-form__switch">
          <input type="checkbox" />
          <span class="slider round"></span>
        </label>
      </div>
      <p className="search-form__text">Короткометражки</p>
    </form>
  )
}