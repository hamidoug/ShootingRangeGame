import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../scss/CreateAccount.scss"

function Login() {

  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();

  const handleLoginClick = async(e)=> {
    e.preventDefault()
    
    try{
      await axios.post('http://127.0.0.1:8000/user_auth/login/', {
        username: username,
        password: password,
    });
      navigate('/userhomepage')
    }
    catch(e){
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
                 <h1>Login To Your Account</h1>
                 <h3>Get A New High Score</h3>
                 <form className="create-account-form"> 
       <label>Enter your username:
         <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} />
       </label>
       <label>Enter your password: 
         <input type="password"  value={password} onChange={(e) =>{setPassword(e.target.value)}}/>
       </label>
       <button onClick={handleLoginClick} className="create-account-submit-button">Login</button>
       { errorMessage && (
        <p style={{color: 'red'}}>{errorMessage}</p>
       )}
     </form>
             </div>
         </div>
     );
 }

export default Login;