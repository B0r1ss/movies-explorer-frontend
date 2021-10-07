import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

//import contexts
import { AppContext } from "../../context/appContext";
import { CurrentUserContext } from "../../context/currentUserContext";
import { MoviesContext } from "../../context/moviesContext";

//import APIs
import moviesApi from "../../utils/MoviesApi";
import mainApi from "../../utils/MainApi";

// import components
import Main from "../Main/Main";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Profile from "../Profile/Profile";
import Movies from "../Movies/Movies";
import SavedMovies from "../SavedMovies/SavedMovies";
import NotFound from "../NotFound/NotFound";

//temp
import cards from "../../utils/cards";

export default function App() {
  const history = useHistory();

  const [loggedIn, setLoggedIn] = React.useState(true);
  const [movies, setMovies] = React.useState([]);
  const [savedMovies, setSavedMovies] = React.useState([]);
  const [isShortMoviesChecked, setIsShortMoviesChecked] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  const [signinErrorMessage, setSigninErrorMessage] = React.useState('')
  const [signupErrorMessage, setSignupErrorMessage] = React.useState('')
  const [editProfileErrorMessage, setEditProfileErrorMessage] = React.useState('')


  React.useEffect(() => {
    /*CHECK TOKEN */
    function tokenCheck() {
      const token = localStorage.getItem("token");
      if (token) {
        Promise.all([
          moviesApi.getMovies(),
/*           mainApi.getUserData(token),
          mainApi.getSavedMovies(token), */
        ])
          .then(([moviesData, userInfo, savedMovesData]) => {

            setUserData();
          })
          .catch((err) => {
            console.log(`Error: ${err}`);
          });
      }
    }
    setMovies(cards)
    setSavedMovies([{"id":1,"nameRU":"«Роллинг Стоунз» в изгнании","nameEN":"Stones in Exile","director":"Стивен Кайак ","country":"США","year":"2010","duration":61,"description":"В конце 1960-х группа «Роллинг Стоунз», несмотря на все свои мегахиты и сверхуспешные концертные туры, была разорена. Виной всему — бездарный менеджмент и драконовское налогообложение в Британии. Тогда музыканты приняли не самое простое для себя решение: летом 1971 года после выхода альбома «Stiсky Fingers» они отправились на юг Франции записывать новую пластинку. Именно там, на Лазурном Берегу, в арендованном Китом Ричардсом подвале виллы Неллькот родился сборник «Exile on Main St.», который стал лучшим альбомом легендарной группы.","trailerLink":"https://www.youtube.com/watch?v=UXcqcdYABFw","created_at":"2020-11-23T14:12:21.376Z","updated_at":"2020-11-23T14:12:21.376Z","image":{"id":1,"name":"stones-in-exile","alternativeText":"","caption":"","width":512,"height":279,"formats":{"thumbnail":{"hash":"thumbnail_stones_in_exile_b2f1b8f4b7","ext":".jpeg","mime":"image/jpeg","width":245,"height":134,"size":8.79,"path":null,"url":"/uploads/thumbnail_stones_in_exile_b2f1b8f4b7.jpeg"},"small":{"hash":"small_stones_in_exile_b2f1b8f4b7","ext":".jpeg","mime":"image/jpeg","width":500,"height":272,"size":25.68,"path":null,"url":"/uploads/small_stones_in_exile_b2f1b8f4b7.jpeg"}},"hash":"stones_in_exile_b2f1b8f4b7","ext":".jpeg","mime":"image/jpeg","size":25.53,"url":"/uploads/stones_in_exile_b2f1b8f4b7.jpeg","previewUrl":null,"provider":"local","provider_metadata":null,"created_at":"2020-11-23T14:11:57.313Z","updated_at":"2020-11-23T14:11:57.313Z"}},])

    tokenCheck();
  }, [history, loggedIn]);

  /*AUTH */
  function onLogin({ password, email }) {
    mainApi
      .signIn({ password: password, email: email })
      .then((res) => {
        mainApi
          .getUserData(res.token)
          .then((res) => {
            setUserData(res);
          })
          .then(() => {
            localStorage.setItem("token", res.token);
            setLoggedIn(true);
            history.push("/");
          })
          .catch((err) => {
            console.log(`Error get content ${err}`);
          });
      })
      .catch((err) => {
        console.log(`Error App onLogin ${err}`);
      });
  }

  function onRegister({ name, password, email }) {
    mainApi
      .signUp({ name: name, password: password, email: email })
      .then(() => {
        history.push("/sign-in");
      })
      .catch((err) => {
        console.log(`Error on regiser ${err}`);
      });
  }

  function handleShortMoviesCheck(evt) {
    setIsShortMoviesChecked(evt.target.checked);
  }

  function handleSignOut(evt) {
    evt.preventDefault();
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUserData("");
    history.push("/sign-in");
  }

  function clearAllErrorMessages() {
    setSigninErrorMessage('');
    setSignupErrorMessage('');
    setEditProfileErrorMessage('');
  }

  function handleSearchMovies(movies, keyWord) {
    let filteredMovies = [];

    movies.forEach((movie) => {
      if (movie.nameRU.indexOf(keyWord) > -1) {
        if (isShortMoviesChecked) {
          if (movie.duration <= 40) {
            return filteredMovies.push(movie);
          }
          return;
        }
        return filteredMovies.push(movie);
      }
    });
    return filteredMovies;
  }

  return (
    <div className='App'>
      <div className='page'>
        <AppContext.Provider
          value={{
            loggedIn: loggedIn,
            onShortMoviesCheck: handleShortMoviesCheck,
            onRegister: onRegister,
            onLogin: onLogin,
            onSignOut: handleSignOut,
            onClear: clearAllErrorMessages,
            onSearchMovies: handleSearchMovies,
            isSaving: "",
            signinErrorMessage: signinErrorMessage,
            signupErrorMessage: signupErrorMessage,
            editProfileErrorMessage: editProfileErrorMessage,
          }}
        >
          <MoviesContext.Provider
            value={{
              movies: movies,
              savedMovies: savedMovies,
            }}
          >
            <CurrentUserContext.Provider
              value={{
                currentUser: userData,
              }}
            >
              <Switch>
                <Route exact path={"/"}>
                  <Main />
                </Route>

                <Route path={"/signin"}>
                  <Login />
                </Route>
                <Route path={"/signup"}>
                  <Register />
                </Route>
                <ProtectedRoute
                  exact
                  path={"/movies"}
                  component={Movies}
                  loggedIn={loggedIn}
                />
                <ProtectedRoute
                  exact
                  path={"/saved-movies"}
                  component={SavedMovies}
                  loggedIn={loggedIn}
                  onDeleteMovie={""}
                />
                <ProtectedRoute
                  exact
                  path={"/profile"}
                  component={Profile}
                  loggedIn={loggedIn}
                />
                <Route path='*'>
                  <NotFound />
                </Route>
              </Switch>
            </CurrentUserContext.Provider>
          </MoviesContext.Provider>
        </AppContext.Provider>
      </div>
    </div>
  );
}
