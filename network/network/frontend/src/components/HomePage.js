import React, { Component } from "react";
import { render } from "react-dom";

export default class Login extends Component 
{
    constructor(props){
        super(props);
        this.state = {
            posts: []
        }
        this.getPosts();
    }

    getPosts(){
        fetch('/api/posts')
        .then((response) => response.json())
        .then((data) => {
            data['detail'].forEach(post => {
                this.setState({
                    posts: this.state.posts.push(post),
                })
                console.log()
                fetch('/api/get-user-id/' + '?id=' + post['owner'])
                .then((response) => response.json())
                .then((data) => {
                    post['owner'] = data.username;
                    console.log(post['owner'])
                    const postDiv = document.createElement('div');
                    postDiv.innerHTML = `${post['owner']}, ${post['content']}, ${post['timestamp']}`;
                    document.querySelector('.post-container').appendChild(postDiv);
                });
            });
        })
    }

    render() 
    {
        // stampare post
        return (
        <div>
            <h1>Posts</h1>
            <div className="post-container">
                
            </div>
        </div>
        )
    }
}