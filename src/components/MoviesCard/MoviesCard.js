import React from "react";
import { useLocation } from "react-router-dom";
import movieImage from "../../images/movieImage.jpg";
import { MoviesContext } from "../../context/moviesContext";

export default function MoviesCard(props) {
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] =
    React.useState(false);

  const [isSaved, setIsSaved] = React.useState(false);

  const moviesContext = React.useContext(MoviesContext);

  const movie = {
    country: props.movie.country || "Не указано",
    director: props.movie.director || "Не указано",
    duration: props.movie.duration || 0,
    year: props.movie.year || "Не указано",
    description: props.movie.description || "Не указано",
    image: `${
      props.movie.image === null
        ? `${movieImage}`
        : `https://api.nomoreparties.co${props.movie.image?.url}`
    }`,
    trailer: props.movie?.trailerLink,
    nameRU: props.movie.nameRU || "Не указано",
    nameEN: props.movie.nameEN || "Не указано",
    thumbnail: `${
      props.movie.image === null
        ? `${movieImage}`
        : `https://api.nomoreparties.co${props.movie.image?.formats?.thumbnail?.url}`
    }`,
    movieId: props.movie.id,
  };

  const editedDuration = `${Math.trunc(movie.duration / 60)} ч ${
    movie.duration % 60
  } м`;
  const image = `${
    props.movie.image === null
      ? `${movieImage}`
      : `https://api.nomoreparties.co${props.movie.image?.url}`
  }`;

  const currentMovie = moviesContext.savedMovies.find(
    (movie) => movie.nameRU === props.movie.nameRU
  );

  const location = useLocation();

  function handleCardMouseOver() {
    setIsDeleteButtonVisible(true);
  }

  function handleCardMouseOut() {
    setIsDeleteButtonVisible(false);
  }

  function handleLikeButtonCLick() {
    props.onMovieSave(movie);
    setIsSaved(true);
  }

  function handleDisLike() {
    setIsSaved(false);
    props.onDeleteMovie(currentMovie._id);
  }

  function handleDeleteMovie() {
    props.onDeleteMovie(props.movie._id);
    setIsSaved(false);
  }

  React.useEffect(() => {
    if (currentMovie) {
      setIsSaved(true);
    }
  }, [currentMovie, location]);

  return (
    <li className='movies__list-item'>
      <a
        href={props.saved ? props.movie.trailer : props.movie.trailerLink}
        className='movies__trailer-link'
      >
        <img
          alt={props.movie.nameRU}
          src={props.saved ? props.movie.image : image}
          className='movies__list-poster'
        />
      </a>

      <div
        onMouseEnter={handleCardMouseOver}
        onMouseLeave={handleCardMouseOut}
        className='movies__list-description'
      >
        <p className='movies__list-title'>{props.movie.nameRU}</p>
        {props.saved ? (
          <button
            className={`movies__list-delete-button ${
              isDeleteButtonVisible ? "movies__list-delete-button_visible" : ""
            }`}
            onClick={handleDeleteMovie}
          ></button>
        ) : (
          <button
            className={`movies__list-like-button ${
              isSaved ? "movies__list-like-button_clicked" : ""
            }`}
            onClick={isSaved ? handleDisLike : handleLikeButtonCLick}
          ></button>
        )}
      </div>
      <p className='movies__list-duration'>{editedDuration}</p>
    </li>
  );
}
