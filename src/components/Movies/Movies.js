import React from "react";
import Header from "../Header/Header";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Footer from "../Footer/Footer";

import { MoviesContext } from "../../context/moviesContext";

export default function Movies() {
  const moviesContext = React.useContext(MoviesContext)

  return (
    <>
      <Header main={false} />
      <SearchForm saved={false} />
      <MoviesCardList 
        movies={moviesContext.movies}
        isSearching={false}
        isErrorActive={false}
        notFound={false}
      />
      <Footer />
    </>
  );
}
