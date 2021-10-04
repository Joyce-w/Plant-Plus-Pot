'use strict'

import './App.css';
import { useState, useEffect } from 'react';
import { decodeToken } from "react-jwt";
import { BrowserRouter, Route, } from "react-router-dom";
import UserContext from './UserContext';
import NavBar from "./NavBar"
import Home from "./Home";
import Register from "./forms/Signup";
import Login from "./forms/Login";
import PlantList from "./Plants/PlantList";
import Plant from "./Plants/Plant";
import UserList from "./UserLists/UserLists";
import List from "./UserLists/List"
import QuizForm from './Quiz/QuizForm';
import Results from "./Quiz/Results"


function App() {

  // const [currUser, setCurrUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  //check if a user has previously logged in
  useEffect(() => {

    const loggedInUser = (localStorage.getItem('token') !== undefined) ? JSON.parse(localStorage.getItem('token')) : undefined;

    function getToken(locUser) {
      
      if (locUser === undefined) {
        setIsLoggedIn(false)
      } else {
        
        setIsLoggedIn(true)
      }
 
    }
      getToken(loggedInUser)
  }, [])


  //updates whether user is loggedin or not
  const loginUser = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  
  const [data, setData] = useState(null)

  const getData = (answers, positions) => {
    let { lighting, watering, has_kids, has_pets, does_flower } = answers;

    setData(() => ({
      ...data,
      does_flower,
      has_kids,
      has_pets,
      lighting: +lighting,
      "pos": positions,
      watering      

    }))

  }

  return (
    <div className="App">
      <UserContext.Provider value={ {isLoggedIn, loginUser} }>
        <BrowserRouter>
          
        <NavBar/>
        <Route exact path="/">
          <Home/>
        </Route>

        {/* Form components */}
        <Route exact path="/register">
          <Register/>
        </Route>
        <Route exact path="/login">
          <Login loginUser={loginUser}/>
        </Route>

        {/* Plant Components */}
        <Route exact path="/plants">
          <PlantList/>
        </Route>

        <Route exact path="/plants/:plant_name">
          <Plant/>
        </Route>

        {/* User Components */}
        <Route exact path="/user-lists">
            <UserList isLoggedIn={ isLoggedIn}/>
        </Route>

        <Route exact path="/user-lists/:list_id">
          <List/>
        </Route>

        
        <Route exact path="/quiz">
          <QuizForm getData={getData}/>
        </Route >

        <Route exact path="/results">
          <Results data={ data}/>
          </Route >
          
        
      </BrowserRouter>
      </UserContext.Provider>
      
    </div>
  );
}

export default App;
