import React, { Component } from "react";

// https://docs.djangoproject.com/en/1.11/ref/csrf/#ajax
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default class NewPost extends Component {
  constructor(params) {
    super(params);
    this.state = {
      content: "",
      logged: "",
    };
    this.IsLoggedIn();
    this.contentChange = this.contentChange.bind(this);
    this.buttonPressed = this.buttonPressed.bind(this);
  }

  IsLoggedIn() {
    fetch("/api/isLoggedIn")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.data);
      })
      .then((data) => {
        console.log(data);
        this.setState({
          logged: true,
        });
      })
      .catch((error) => {
        this.setState({
          logged: false,
        })
      });
  }

  contentChange(e) {
    this.setState({
      content: e.target.value,
    });
  }

  buttonPressed(e) {
    e.preventDefault();
    if (parseInt(this.state.content.length) === 0) {
      document.querySelector("#error-message").innerHTML = "Write something";
      return -1;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        content: this.state.content,
      }),
    };
    fetch("/api/create-post", requestOptions)
      .then((response) => response.json())
      .then((data) => window.location.href = '/');
  }

  render() {
    if (this.state.logged === false) {
      return <h5 id="error-message">You're not logged in</h5>;
    }
    return (
      <div className="mt-3">
        <h1>New Post</h1>
        <h5 id="error-message"></h5>
        <form className="mt-5">
          <label for="content">Post Content</label>
          <textarea
            name="content"
            type="text"
            id="content"
            className="form-control"
            onChange={this.contentChange}
          />
          <input
            type="submit"
            className="btn btn-primary mt-3"
            value="Post"
            onClick={this.buttonPressed}
          />
        </form>
      </div>
    );
  }
}
