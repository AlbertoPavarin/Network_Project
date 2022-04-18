import React, { Component } from "react";
import { render } from "react-dom";

export default class Login extends Component 
{
    constructor(props){
        super(props);
        this.state = {
            owners: [],
            contents: [],
            timestamps: [],
        }
        this.getPosts();
    }

    getPosts(){
        fetch('/api/posts')
        .then((response) => response.json())
        .then((data) => {
            data['detail'].forEach(post => {
                this.setState({
                    owners: this.state.owners.push(post['owner']),
                    contents: this.state.contents.push(post['content']),
                    timestamps: this.state.timestamps.push(post['timestamp'])
                })
            });
            console.log(this.state.owners)
        })
    }

    render() 
    {
        // stampare post
        return (
        <div>
            <h1>Posts</h1>
        </div>
        )
    }
}