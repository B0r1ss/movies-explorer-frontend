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

  const [movies, setMovies] = React.useState([])

  React.useEffect(()=> {
    setMovies(moviesContext.savedMovies)
    if (appContext.isShortMoviesChecked) {
      setMovies(appContext.shortMoviesSearch(movies))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appContext.isShortMoviesChecked, moviesContext.savedMovies])

  React.useEffect(()=> {
    setMovies(moviesContext.searchedSavedMovies)
  }, [moviesContext.searchedSavedMovies])

    return (
        <>
            <Header loggedIn={props.loggedIn} main={false}/>
            <SearchForm saved={true}/>
            <MoviesCardList 
              saved={true}
              movies={movies}
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