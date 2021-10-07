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

  return (
    <>
      <Header main={false} />
      <SearchForm saved={false} />
      <MoviesCardList 
        movies={moviesContext.movies}
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
