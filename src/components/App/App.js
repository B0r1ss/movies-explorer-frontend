import React from "react";
import { Route, Switch, useHistory, useLocation, Redirect } from "react-router-dom";

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
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [userData, setUserData] = React.useState({});

  //movies data
  const [movies, setMovies] = React.useState([]);
  const [savedMovies, setSavedMovies] = React.useState([]);
  const [searchedMovies, setSearchedMovies] = React.useState([]);
  const [searchedSavedMovies, setSarchedSavedMovies] = React.useState([]);

  //error messages
  const [signinErrorMessage, setSigninErrorMessage] = React.useState("");
  const [signupErrorMessage, setSignupErrorMessage] = React.useState("");
  const [editProfileErrorMessage, setEditProfileErrorMessage] =
    React.useState("");

  //states
  const [isShortMoviesChecked, setIsShortMoviesChecked] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);
  const [inProgressUpdate, setinProgressUpdate] = React.useState(true);
  const [notFoundErr, setNotFoundErr] = React.useState(false);
  const [isMoviesErrorActive, setIsMoviesErrorActive] = React.useState(false);
  let isLoggedIn = localStorage.getItem("token");


  React.useEffect(() => {
    /*CHECK TOKEN */
    function tokenCheck() {
      const token = localStorage.getItem("token");
      if (token) {
        setInProgress(true)
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
            setInProgress(false)
          })
          .catch((err) => {
            setInProgress(false)
            console.log(`Error: ${err}`);
          });
      }
    }
    tokenCheck();
  }, [history, isLoggedIn]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setEditProfileErrorMessage('');
      mainApi.getSavedMovies(token)
        .then((res) => {
            setSavedMovies(res);
        })
        .catch((err)=>{
          console.log(err)
        })

        moviesApi.getMovies()
          .then((movs)=>{
            setMovies(movs)
          }).catch((err)=>{
            console.log(err)
          })
    }
}, [location]);

  /*AUTH */
  function onLogin(password, email) {
    setInProgress(false);
    mainApi
      .signIn({password, email})
      .then((res) => {
        if (res.token) {
          localStorage.setItem("token", res.token)
          isLoggedIn=true
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
        if (res.name) {
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
    setinProgressUpdate(true);
    mainApi
      .editUserData({ token, name, email })
      .then((newUser) => {
        if (newUser._id) {
          setUserData(newUser);
          setinProgressUpdate(true);
          setEditProfileErrorMessage("Профиль обновлен успешно!");
        } else {
          setEditProfileErrorMessage(newUser.message);
          setinProgressUpdate(false);
        }
      })
      .catch(() => {
        setEditProfileErrorMessage("Произошла ошибка");
        setinProgressUpdate(false);
      });
  }

  function handleShortMoviesCheck(evt) {
    setIsShortMoviesChecked(evt.target.checked);
  }

  function handleShortMoviesSearch(movies) {
    const shortMoviesArray = movies.filter(
        (movie) => movie.duration <= 40
    );
    return shortMoviesArray;
  }

  function handleSignOut(evt) {
    evt.preventDefault();
    localStorage.removeItem("token");
    isLoggedIn=false
    setUserData("");
    history.push("/");
  }

  function clearAllErrorMessages() {
    setSigninErrorMessage("");
    setSignupErrorMessage("");
    setEditProfileErrorMessage("");
  }

// SERACHING MOVIES

  function handleSearchMovies({ serchMovies, keyWord }) {
    let filteredMovies = [];
    serchMovies.forEach((movie) => {
      if (movie.nameRU.toLowerCase().indexOf(keyWord.toLowerCase()) > -1) {
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
    setInProgress(true)
    setNotFoundErr(false);
    setIsMoviesErrorActive(false);
    const searchSavedMovies = handleSearchMovies({ serchMovies: savedMovies, keyWord });
    if (searchSavedMovies.length === 0) {
      setInProgress(false)
      setNotFoundErr(true);
      setSarchedSavedMovies([]);
    } else {
      setInProgress(false)
      setNotFoundErr(false);
      setSarchedSavedMovies(searchSavedMovies);
    }
  }

  function searchMovies(keyWord) {
    setInProgress(true)
    setNotFoundErr(false);
    setIsMoviesErrorActive(false);
    if (movies.length === 0) {
      moviesApi.getMovies()
        .then((movies) => {
          setMovies(movies);
          const searchResult = handleSearchMovies({ serchMovies:movies, keyWord });
          if (searchResult.length === 0) {
            setInProgress(false)
            setNotFoundErr(true);
            setSearchedMovies([]);
          } else {
            setSearchedMovies(searchResult);
          }
        })
        .catch(() => {
          setInProgress(false)
          setIsMoviesErrorActive(true);
          setSearchedMovies([]);
        })
    } else {
      const searchResult = handleSearchMovies({ serchMovies:movies, keyWord });

      if (searchResult.length === 0) {
        setNotFoundErr(true);
        setSearchedMovies([]);
        setInProgress(false);
        setIsShortMoviesChecked(false);
      } else {
        setSearchedMovies(searchResult);
        setInProgress(false);
        setIsShortMoviesChecked(false);
      }
    }
  }

//SAVING MOVIES

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
            loggedIn: isLoggedIn,
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
            shortMoviesSearch: handleShortMoviesSearch,

            notFoundErr: notFoundErr,
            inProgress: inProgress,
            inProgressUpdate: inProgressUpdate,
            isMoviesErrorActive: isMoviesErrorActive,
            signinErrorMessage: signinErrorMessage,
            signupErrorMessage: signupErrorMessage,
            editProfileErrorMessage: editProfileErrorMessage,
            isShortMoviesChecked: isShortMoviesChecked,
          }}
        >
          <MoviesContext.Provider
            value={{
              movies: movies,
              savedMovies: savedMovies,
              searchedMovies: searchedMovies,
              searchedSavedMovies: searchedSavedMovies,
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
                  {isLoggedIn ? <Redirect to="/" /> :<Login />}
                </Route>
                <Route path={"/signup"}>
                  {isLoggedIn ? <Redirect to="/" /> :<Register />}
                </Route>
                <ProtectedRoute
                  exact
                  path={"/movies"}
                  component={Movies}
                  loggedIn={isLoggedIn}
                />
                <ProtectedRoute
                  exact
                  path={"/saved-movies"}
                  component={SavedMovies}
                  loggedIn={isLoggedIn}
                />
                <ProtectedRoute
                  exact
                  path={"/profile"}
                  component={Profile}
                  loggedIn={isLoggedIn}
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
