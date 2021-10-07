import React from "react";
import Header from "../Header/Header";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Footer from "../Footer/Footer";
import { MoviesContext } from "../../context/moviesContext";

function SavedMovies(props) {
  const moviesContext = React.useContext(MoviesContext)
    return (
        <>
            <Header loggedIn={props.loggedIn} main={false}/>
            <SearchForm/>
            <MoviesCardList 
              saved={true}
              movies={moviesContext.savedMovies}
            />
            <Footer />
        </>
    )
}

export default SavedMovies;