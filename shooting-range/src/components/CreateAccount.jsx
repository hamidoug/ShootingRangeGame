import React from "react";
import ReactDOM from 'react-dom/client';
import "../scss/CreateAccount.scss"
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import CSRFToken from "./CSRFToken";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;



function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, showSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  const handleCreateAccountSubmitClick = async(e) => {
    e.preventDefault();
    const csrfToken = Cookies.get('csrftoken');
    console.log('CSRF Token:', csrfToken); 

    if (!csrfToken) {
        setErrorMessage('CSRF token is missing!');
        return;
    }

   try{ await axios.post('http://127.0.0.1:8000/user_auth/createaccount/', JSON.stringify({username, password}), {headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRFToken': Cookies.get('csrftoken')}});

    showSuccessMessage(true)
    setErrorMessage('')
    
  }
    catch(e) {
      if (e.response && e.response.data && e.response.data.error) {
        setErrorMessage(e.response.data.error);
      } else {
        setErrorMessage('An unexpected error occurred')
      }
    }
  };
  
    return (
        <div className="create-account-page">
            <div className="create-account-header">
                <h1>Create Your Account</h1>
                <h3>Keep Track of Your Progress</h3>
                <form className="create-account-form"> 
                  <CSRFToken />
      <label>Choose your username:
        <input type="text" value={username || ''} onChange={(e)=>{setUsername(e.target.value)}} />
      </label>
      <label>Choose your password: 
        <input type="password" value={password || ''} onChange={(e)=>{setPassword(e.target.value)}}/>
      </label>
      {successMessage ? (
        <div className="create-account-success-message">
        <p>Account Created Successfully</p>
        <Link to="/login"><button className="create-account-submit-button" style={{width: '110px'}}>Go To Login Page</button> </Link>
        </div>
      ) : (
        <>
      <button onClick={handleCreateAccountSubmitClick} className="create-account-submit-button">Submit</button>
      {errorMessage && (
        <p style={{color: 'red'}}>{errorMessage}</p>
      )}
      </>
      )}
    </form>
            </div>
        </div>
    );
}

export default CreateAccount;
