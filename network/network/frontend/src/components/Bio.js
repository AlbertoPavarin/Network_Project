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

export default class Bio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      info: "",
      logged: "",
    };
    this.fileInput = React.createRef();
    this.IsLoggedIn();
    this.firstNameChange = this.firstNameChange.bind(this);
    this.lastNameChange = this.lastNameChange.bind(this);
    this.infoChange = this.infoChange.bind(this);
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

  firstNameChange(e){
        this.setState({
            firstName: e.target.value,
        })
  }

  lastNameChange(e){
        this.setState({
            lastName: e.target.value,
        })
  }

  infoChange(e){
    this.setState({
      info: e.target.value,
    })
  }

  buttonPressed(e){
      e.preventDefault();
      console.log(`${this.state.firstName} ${this.state.lastName}`);
      const requestOptions = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          info: this.state.info,
          profile_pic: this.fileInput.current.files[0],
        }),
      };
      fetch('/api/edit-bio/', requestOptions)
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
          //window.location.href = "/"
      })
  }

  render() {
    if (this.state.logged === false) {
      return <h5 id="error-message">You're not logged in</h5>;
    }
    return (
        <div className="mr-4 ml-4">
        <form className="login mt-5">
            <h1>Bio</h1>
            <h5 id="error-message"></h5>
            <label className="mt-4" htmlFor="first-name">
              First Name
            </label>
            <input name="first-name" type="text" className="form-control w-100" onChange={this.firstNameChange}/>
            <label className="mt-4" htmlFor="last-name">
              Last Name
            </label>
            <input name="last-name" type="text" className="form-control w-100" onChange={this.lastNameChange}/>
            <label className="mt-4" htmlFor="info">
              Info
            </label>
            <input name="info" type="text" className="form-control w-100" onChange={this.infoChange}/>
            <input type="Button" className="btn btn-primary mt-4" value="Edit Bio" onClick={this.buttonPressed} />
        </form>
      </div>
    );
  }
}
