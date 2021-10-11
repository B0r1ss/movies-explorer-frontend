import background from "../../images/background-main.svg";

export default function Promo() {
  return (
    <section className="promo">
      <div className="promo__section">
        <h1 className="promo__title">
          Учебный проект студента факультета Веб-разработки.
        </h1>
        <p className="promo__text">
          Листайте ниже, чтобы узнать больше про этот проект и его создателя.
        </p>
        <a className="promo__button" href="#about">
          Узнать больше
        </a>
      </div>
      <img className="promo__img" src={background} alt="Обложка" />
    </section>
  );
}
