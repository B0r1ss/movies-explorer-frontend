class MainApi {
  constructor({baseUrl}) {
    this._baseUrl = baseUrl;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  signIn({password, email}) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
      .then((res) => {
        return this._getResponseData(res);
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        return data;
      });
  }

  signUp({name, password, email}) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: name,
        password: password,
        email: email,
      }),
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  getUserData(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  editUserData({token, name, email}) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        name: name,
        email: email,
      }),
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  getSavedMovies(token) {
    return fetch(`${this._baseUrl}/movies`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  saveMovie(token, movie) {
    return fetch(`${this._baseUrl}/movies`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailer: movie.trailer,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: movie.thumbnail,
        movieId: movie.movieId,
      }),
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  deleteMovie(token, movieId) {
    return fetch(`${this._baseUrl}/movies/${movieId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => {
        return this._getResponseData(res);
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        return data;
      });
  }
}

const mainApi = new MainApi({
  baseUrl: "https://movies-explorer.bor.nomoredomains.club/api"
})

export default mainApi
