import React from "react";
import Header from "../Header/Header";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Footer from "../Footer/Footer";

import { AppContext } from "../../context/appContext";
import { MoviesContext } from "../../context/moviesContext";

export default function Movies() {
  const moviesContext = React.useContext(MoviesContext)
  const appContext = React.useContext(AppContext);
  const [movies, setMovies] = React.useState([])

  React.useEffect(()=> {
    setMovies(moviesContext.movies)
    if (appContext.isShortMoviesChecked) {
      setMovies(appContext.shortMoviesSearch(movies))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appContext.isShortMoviesChecked, moviesContext.movies])

  React.useEffect(()=> {
    setMovies(moviesContext.searchedMovies)
  }, [moviesContext.searchedMovies])


  return (
    <>
      <Header main={false} />
      <SearchForm saved={false} />
      <MoviesCardList 
        movies={movies}
        isSearching={appContext.inProgress}
        isMoviesErrorActive={appContext.isMoviesErrorActive}
        notFound={appContext.notFoundErr}
        onDeleteMovie={appContext.onDeleteMovie}
        onMovieSave={appContext.onSaveMovie}
      />
      <Footer />
    </>
  );
}
