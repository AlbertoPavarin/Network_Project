import React, { Component } from "react";

export default class SearchResults extends Component {
    constructor(props) {
      super(props);
      this.state = {  
        searchTxt: window.location.pathname.split('Search/')[1]
      }
      this.getSearchResults();
    }
    // https://docs.djangoproject.com/en/1.11/ref/csrf/#ajax
    getCookie(name) {
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
    

    getSearchResults() {
        console.log('sdrogo ' + this.state.searchTxt)
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": this.getCookie("csrftoken"),
            },
            body: JSON.stringify({
                username: this.state.searchTxt,
            }),
        };
        fetch("/api/search-users", requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.data);
        })
        .then((data) => {
            data['users'].forEach((user) => {
                console.log(user);
                const element = document.createElement('div');
                element.className = 'result-user'
                element.innerHTML = user['username'];
                element.onclick = () => window.location.href = `/User/${user['username']}`
                document.querySelector('#result-wrapper').appendChild(element)
            })
        });
    }


    render(){
        return (
        <div>
            <h1>Search Results</h1>
            <div id='result-wrapper'>
            </div>
        </div>
        )
    }
}