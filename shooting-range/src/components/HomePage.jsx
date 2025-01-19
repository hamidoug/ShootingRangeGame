import React from 'react';
import ReactDOM from 'react-dom/client';
import "../scss/HomePage.scss";
import { Link } from 'react-router-dom';


function HomePage() {
    return (
        <div className="home-page">
<div className='main-menu'>
    <h1>Shooting Range</h1>
    <h4>Improve Your Aim</h4>
    <div className='login-options'>
        <Link to="/login" className='login-button'>
            <p> Login </p>
        </Link>
        <Link to="/createaccount" className='create-account-button'>
            <p>Create Account</p>
        </Link>
    </div>
</div>
        </div>
    );
}

export default HomePage;