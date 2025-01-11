import logo from '../logo.svg';
import '../App.css';
import HomePage from './HomePage';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CreateAccount from './CreateAccount';
import Login from './Login';
import UserHomePage from './UserHomePage';
import EasyLevel from './EasyMode';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />
      <Route path="/userhomepage" element={<UserHomePage />} />
      <Route path="/easymode" element={<EasyLevel />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
