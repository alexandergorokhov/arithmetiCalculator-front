import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import LoginPage from './login/login';
import CalculatorPage from './calculator/calculator';
import RecordsPage from './records/records';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.clear();
    console.log("Logging out");
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route
            path="/calculator"
            element={<CalculatorPage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
          />
          <Route
            path="/records"
            element={<RecordsPage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
