import React, { Component } from "react";
import "./App.css";
import Movie from "./Movie";

class App extends Component {
  state = {
    page: 1,
    adding: false
  };

  componentDidMount() {
    this._getMovies();
    // window.addEventListener('scroll',this._infiniteScroll);
  }

  _infiniteScroll = () => {
    let scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    let scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    let offsetHeight = document.documentElement.offsetHeight;

    if (scrollTop + offsetHeight >= scrollHeight) {
      this._addMovies();
    }
  };

  _getMovies = async () => {
    const movies = await this._callApi(this.state.page);
    this.setState({
      movies,
      page: this.state.page + 1
    });
  };
  _callApi = page => {
    return fetch(
      "https://yts.lt/api/v2/list_movies.json?sort_by=download_count&limit=10&page=" +
        page
    )
      .then(response => response.json())
      .then(json => json.data.movies)
      .catch(err => console.log(err));
  };
  _renderMovies = () => {
    const movies = this.state.movies.map((movie, index) => {
      return (
        <Movie
          title={movie.title_english}
          poster={movie.medium_cover_image}
          genres={movie.genres}
          synopsis={movie.synopsis}
          key={movie.id}
          rating={index}
        />
      );
    });
    return movies;
  };

  _addMovies = async () => {
    if (this.state.adding) {
      return alert('불러오는 중 입니다.');
    } else {
      this.setState({
        adding: !this.state.adding
      })
      const movies = await this._callApi(this.state.page);
      this.setState({
        movies: [...this.state.movies, ...movies],
        page: this.state.page + 1
      });
      this.setState({
        adding: !this.state.adding
      })
    }
  };

  render() {
    return (
      <div className={this.state.movies ? "App" : "App-loading"}>
        {this.state.movies ? this._renderMovies() : "Loading"}
        {this.state.movies ? (
          <div className="change" onClick={this._addMovies}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="white" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
