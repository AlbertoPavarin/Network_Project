import React, { Component } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";
import HomePage from './HomePage';
import Register from "./Register";
import Profile from "./Profile";
import NewPost from "./NewPost";
import Login from "./Login";
import Comments from "./Comments";
import Post from "./Post";
import Bio from "./Bio";
import Following from "./Following";
import Follower from "./Follower";
import FollowingPosts from "./FollowingPosts";
import Chat from "./Chat";

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/User/:username" element={<Profile />}/>
          <Route path="/NewPost" element={<NewPost />} />
          <Route path="/Comments/:id" element={<Comments />} />
          <Route path="/Post/:id" element={<Post/>} />
          <Route path="/EditBio" element={<Bio/>} />
          <Route path="/User/Following/:username" element={<Following />} />
          <Route path="/User/Follower/:username" element={<Follower />} />
          <Route path="/Following/Posts" element={<FollowingPosts />} />
          <Route path="Chat/:room_name" element={<Chat />}/>
        </Routes>
      </Router>
    );
  }
}