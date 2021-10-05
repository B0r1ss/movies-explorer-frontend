import Header from "../Header/Header";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Footer from "../Footer/Footer";

export default function Movies() {
  return (
    <>
      <Header main={false} />
      <SearchForm saved={false} />
      <MoviesCardList 
        isSearching={false}
      />
      <Footer />
    </>
  );
}
