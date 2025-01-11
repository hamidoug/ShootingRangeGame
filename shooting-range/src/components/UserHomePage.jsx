import React from "react";
import ReactDOM from 'react-dom/client';
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "../scss/UserHomePage.scss";




function UserHomePage() {
const [highScores, setHighScores] = useState({
    easy_high_score: 0,
    medium_high_score: 0,
    hard_high_score: 0,
});
useEffect(() => {
    axios.get('http://127.0.0.1:8000/user_auth/fetchhighscore/', { withCredentials: true })
    .then((response) => {
        setHighScores(response.data);
    })
    .catch((error) => {
        console.error('Error:', error.response?.data || error.message);
    });
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
    <Link to="/easymode"><button className="login-button">Easy</button> </Link>
    <button className="login-button">Medium</button>
    <button className="login-button">Hard</button>
    </div>
</div>
</div>

);
}

export default UserHomePage;