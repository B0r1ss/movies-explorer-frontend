import React from "react";
import Header from "../Header/Header";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Footer from "../Footer/Footer";
import { MoviesContext } from "../../context/moviesContext";
import { AppContext } from "../../context/appContext";

function SavedMovies(props) {
  const moviesContext = React.useContext(MoviesContext)
  const appContext = React.useContext(AppContext);

    return (
        <>
            <Header loggedIn={props.loggedIn} main={false}/>
            <SearchForm saved={true}/>
            <MoviesCardList 
              saved={true}
              movies={moviesContext.savedMovies}
              isSearching={appContext.inProgress}
              isMoviesErrorActive={appContext.isMoviesErrorActive}
              notFound={appContext.notFoundErr}
              onMovieSave={appContext.onSaveMovie}
              onDeleteMovie={appContext.onDeleteMovie}
            />
            <Footer />
        </>
    )
}

export default SavedMovies;