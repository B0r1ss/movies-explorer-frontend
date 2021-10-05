import photo from "../../images/photo.jpg";
export default function AboutMe() {
  return (
    <section className="about-me">
      <h2 className="about-project__title section__title">Студент</h2>
      <div className="about-me__card">
        <div className="about-me__info">
          <h1 className="about-me__name">Владимир</h1>
          <h3 className="about-me__about">Фронтенд-разработчик, 31 год</h3>
          <p className="about-me__text">
            Я родился и живу в Саратове, закончил факультет экономики СГУ. У
            меня есть жена и дочь. Я люблю слушать музыку, а ещё увлекаюсь
            бегом. Недавно начал кодить. С 2015 года работал в компании «СКБ
            Контур». После того, как прошёл курс по веб-разработке, начал
            заниматься фриланс-заказами и ушёл с постоянной работы.
          </p>
          <nav className="about-me__nav">
            <ul className="about-me__lists">
              <li className="about-me__list">
                <a className="about-me__link" href="https://www.facebook.com/">
                  Facebook
                </a>
              </li>
              <li className="about-me__list">
                <a className="about-me__link" href="https://github.com/B0r1ss">
                  Github
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <img className="about-me__photo" src={photo} alt="Фото автора" />
      </div>
    </section>
  );
}
