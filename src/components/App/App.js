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

export default function App() {
  const history = useHistory();

  const [loggedIn, setLoggedIn] = React.useState(false);
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
          mainApi.getUserData(token),
          mainApi.getSavedMovies(token),
        ])
          .then(([moviesData, userInfo, savedMovesData]) => {
            setMovies(moviesData);
            setUserData(userInfo);
            setSavedMovies(savedMovesData);
          })
          .catch((err) => {
            console.log(`Error: ${err}`);
          });
      }
    }
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
              savedMovies: "",
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
