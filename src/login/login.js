import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loginFailed, setLoginFailed] = useState(false); // New state for login failure
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      username: username,
      password: password
    };

    await login(loginData);
  };

  const login = async (loginData) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const token = await response.json();
        setToken(token.result);
        sessionStorage.setItem('token', token.result);
        setIsLoggedIn(true); 
        console.log("loggin is true");
        navigate('/calculator/');

        console.log('Login successful. Token stored.');
      } else if (response.status === 403) {
        setLoginFailed(true); 
        console.log('Login failed. Access denied.');
      } else {
        console.log('Login failed.');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <div>
      {loginFailed && ( 
        <div className="popup">
          <p>Login failed. Access denied.</p>
        </div>
      )}
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
