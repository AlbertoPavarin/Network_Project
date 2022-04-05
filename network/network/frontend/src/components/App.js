import React, { Component } from "react";
import { render } from "react-dom";

export default class App extends Component 
{
    constructor(props){
        super(props);
    }

    render() 
    {
        return <h1>Testing</h1>;
    }
}

const div = document.getElementById("app");
render(<App />, div);