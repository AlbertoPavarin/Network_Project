import React, { Component } from 'react';

export default class NewPost extends Component{
    constructor(params) {
        super(params);
        this.state = {
            content: "",
        }
        this.contentChange = this.contentChange.bind(this);
        this.buttonPressed = this.buttonPressed.bind(this);
    }

    contentChange(e){
        this.setState({
            content: e.target.value
        });
    }

    buttonPressed(e){
        e.preventDefault();
        console.log(this.state.content.length)
        if (parseInt(this.state.content.length) === 0){
            document.querySelector('#error-message').innerHTML = "Write something";
            return -1;
        }
        const requestOptions = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: this.state.content,
            }),
          };
        fetch('/api/create-post', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));
    }

    render(){
        return(
            <div className='mt-3'>
                <h1>New Post</h1>
                <h5 id="error-message"></h5>
                <form className='mt-5'>
                    <label for="content">Post Content</label>
                    <input name="content" type="text" className='form-control content' onChange={this.contentChange}/>
                    <input type="submit" className='btn btn-primary mt-3' value="Post" onClick={this.buttonPressed}/>
                </form>
            </div>
        );
    }
}