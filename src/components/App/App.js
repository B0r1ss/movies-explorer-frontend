import React from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

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
  const location = useLocation();

  //user data
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [userData, setUserData] = React.useState({});

  //movies data
  const [movies, setMovies] = React.useState([]);
  const [savedMovies, setSavedMovies] = React.useState([]);

  //error messages
  const [signinErrorMessage, setSigninErrorMessage] = React.useState("");
  const [signupErrorMessage, setSignupErrorMessage] = React.useState("");
  const [editProfileErrorMessage, setEditProfileErrorMessage] =
    React.useState("");

  //states
  const [isShortMoviesChecked, setIsShortMoviesChecked] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);
  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const [notFoundErr, setNotFoundErr] = React.useState(false);
  const [isMoviesErrorActive, setIsMoviesErrorActive] = React.useState(false);


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
            setToken(localStorage.getItem("token"));
            setUserData(userInfo);
            setSavedMovies(savedMovesData);
            setMovies(moviesData);
            setLoggedIn(true);
          })
          .catch((err) => {
            console.log(`Error: ${err}`);
          });
      }
    }
    tokenCheck();
  }, [history, loggedIn]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setEditProfileErrorMessage('');

    mainApi.getSavedMovies(token)
        .then((res) => {
            setSavedMovies(res);
        })
}, [location]);

  /*AUTH */
  function onLogin(password, email) {
    setInProgress(true);
    mainApi
      .signIn({password, email})
      .then((res) => {
        if (res.token) {
          localStorage.setItem("token", res.token)
          setLoggedIn(true);
          setSigninErrorMessage("");
          history.push("/movies");
        } else {
          setSigninErrorMessage(res.message);
        }
      })
      .catch(() => {
        setSigninErrorMessage("Что-то пошло не так...");
      })
      .finally(() => {
        setInProgress(false);
      });
  }

  function onRegister(name, password, email) {
    setInProgress(true);
    mainApi
      .signUp({name, password, email})
      .then((res) => {
        if (res.user) {
          setSignupErrorMessage("");
          onLogin(password, email);
        } else {
          setSignupErrorMessage(res.message);
        }
      })
      .catch(() => {
        setSignupErrorMessage("Что-то пошло не так...");
      })
      .finally(() => {
        setInProgress(false);
      });
  }

  function onEditUserInfo(name, email) {
    mainApi
      .editUserData({ token, name, email })
      .then((newUser) => {
        if (newUser._id) {
          setUserData(newUser);
          setUpdateSuccess(true);
          setEditProfileErrorMessage("Профиль обновлен успешно!");
        } else if (newUser.message) {
          setEditProfileErrorMessage(newUser.message);
          setUpdateSuccess(false);
        }
      })
      .catch(() => {
        setEditProfileErrorMessage("Произошла ошибка");
        setUpdateSuccess(false);
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
    setSigninErrorMessage("");
    setSignupErrorMessage("");
    setEditProfileErrorMessage("");
  }

  function handleSearchMovies({ serchMovies, keyWord }) {
    let filteredMovies = [];
    serchMovies.forEach((movie) => {
      if (movie.nameRU.indexOf(keyWord) > -1) {
        if (isShortMoviesChecked) {
          if (movie.duration <= 40) {
            return filteredMovies.push(movie);
          }
        }
        return filteredMovies.push(movie);
      }
    });
    return filteredMovies;
  }

  function searchSavedMovies(keyWord) {
    const searchSavedMovies = handleSearchMovies({ serchMovies:savedMovies, keyWord });
    setSavedMovies(searchSavedMovies);
  }

  function searchMovies(keyWord) {
    setInProgress(true);
    setNotFoundErr(false);
    setIsMoviesErrorActive(false);
    if (movies.length === 0) {
      moviesApi.getMovies()
        .then((movies) => {
          setMovies(movies);
          console.log(movies)
          const searchResult = handleSearchMovies({ serchMovies:movies, keyWord });
          if (searchResult.length === 0) {
            setNotFoundErr(true);
            setMovies([]);
          } else {
            setMovies(searchResult);
          }
        })
        .catch(() => {
          setIsMoviesErrorActive(true);
          setMovies([]);
        })
        .finally(() => {
          setInProgress(false);
          setIsShortMoviesChecked(false);
        });
    } else {
      const searchResult = handleSearchMovies({ serchMovies:movies, keyWord });

      if (searchResult.length === 0) {
        setNotFoundErr(true);
        setMovies([]);
        setInProgress(false);
        setIsShortMoviesChecked(false);
      } else {
        setMovies(searchResult);
        setInProgress(false);
        setIsShortMoviesChecked(false);
      }
    }
  }

  function handleSaveMovie(movie) {
    mainApi
      .saveMovie(token, movie)
      .then((savedMovie) => {
        const movies = [...savedMovies, savedMovie];
        setSavedMovies(movies);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}, попробуйте еще раз`);
      });
  }

  function handleDeleteMovie(movieId) {
    mainApi
      .deleteMovie( token, movieId )
      .then(() => {
        const newSavedMovies = savedMovies.filter((deletedMovie) => {
          return deletedMovie._id !== movieId;
        });
        setSavedMovies(newSavedMovies);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}, попробуйте еще раз`);
      });
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
            onEditUserInfo: onEditUserInfo,
            onSearchMovies: searchMovies,
            onSearchSavedMovies: searchSavedMovies,
            onSaveMovie: handleSaveMovie,
            onDeleteMovie: handleDeleteMovie,

            notFoundErr: notFoundErr,
            inProgress: inProgress,
            isMoviesErrorActive: isMoviesErrorActive,
            signinErrorMessage: signinErrorMessage,
            signupErrorMessage: signupErrorMessage,
            editProfileErrorMessage: editProfileErrorMessage,
            isUpdateSuccess: updateSuccess,
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
