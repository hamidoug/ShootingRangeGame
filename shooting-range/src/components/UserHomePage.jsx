import React from "react";
import ReactDOM from 'react-dom/client';
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "../scss/UserHomePage.scss";
import CSRFToken from "./CSRFToken";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

function UserHomePage() {
      const [errorMessage, setErrorMessage] = useState('')
const navigate = useNavigate();
    const handleEasyModeClick = () => {
            navigate('/easymode');
    };
    const handleLogoutClick = async(e)=> {
        e.preventDefault()
        
        try{
        await axios.post('http://127.0.0.1:8000/user_auth/logout/', {}, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRFToken': Cookies.get('csrftoken')}});
          navigate('/')
        }
        catch(e){
          if (e.response && e.response.data && e.response.data.error) {
            setErrorMessage(e.response.data.error);
          } else {
            setErrorMessage('An unexpected error occurred')
          }
         }
     };
const [highScores, setHighScores] = useState({
    easy_high_score: 0,
    medium_high_score: 0,
    hard_high_score: 0,
});

useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const csrfToken = Cookies.get('csrftoken');
            console.log('CSRF Token:', csrfToken);

            const response = await axios.get('http://127.0.0.1:8000/user_auth/user_profile', {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Accept': 'application/json',
                },
                withCredentials: true,
            });

            const { Profile } = response.data;
            setHighScores({
                easy_high_score: Profile.easy_high_score,
                medium_high_score: Profile.medium_high_score,
                hard_high_score: Profile.hard_high_score,
            });
            console.log('Fetch highscores successful:', response.data);
        } catch (error) {
            console.error('Error fetching high scores:', error.response?.data || error.message);
        }
    };
    fetchUserProfile();
}, []);


    return(
<div className="userhomepage">
    <div className="highscore-menu">
        <h2>High Scores</h2>
        <h3>Easy: {highScores.easy_high_score}</h3>
        <h3>Medium: {highScores.medium_high_score}</h3>
        <h3>Hard: {highScores.hard_high_score}</h3>

    </div>
<div className="game-menu">
    <h1 style={{fontSize: '100px'}}>Play Now</h1>
    <h3 style={{fontSize: '25px'}}>Choose Difficulty Level</h3>
    <div className="difficulty-levels">
<button className="login-button" onClick={handleEasyModeClick}>Easy</button>
    <button className="login-button">Medium</button>
    <button className="login-button">Hard</button>
    </div>
    <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
</div>
</div>

);
}

export default UserHomePage;