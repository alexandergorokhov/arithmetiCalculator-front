import React, { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';


const CalculatorPage = ({isLoggedIn, handleLogout }) => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState('');


  const navigate = useNavigate();

  const getToken = () => {
    const token =sessionStorage.getItem('token');
    console.log(token);
    if (!token) {
      navigate('/'); 
    }
    return token;
  };

  useEffect(() => {
    getToken(); // Check login status during page load
  }, []); 

  const handleNum1Change = (e) => {
    setNum1(e.target.value);
  };

  const handleNum2Change = (e) => {
    setNum2(e.target.value);
  };

  const handleCalculation = async (operationId) => {
    const url = `http://localhost:8080/api/v1/calculator/arithmeticOperation`;

    const token = getToken();

    const calculationData = {
      operationId: parseInt(operationId),
      operand1: parseFloat(num1),
      operand2: parseFloat(num2)
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(calculationData)
      });

      if (response.ok) {
        const result = await response.text();
        console.log(JSON.parse(result));
        setResult(`Result: ${JSON.parse(result).result}`);
      } else {
        if(response.status == 403){
          navigate('/');}
        setResult('Error occurred during calculation');
      }
    } catch (error) {
      console.log(error.Authorization);
      if(error.Authorization){
        navigate('/');
      }else{
        setResult('Error occurred during calculation');
        console.error('Error occurred during calculation:', error);
      }
     
    }
  };

  const handleAddition = () => {
    handleCalculation(1);
  };

  const handleSubtraction = () => {
    handleCalculation(2);
  };

  const handleMultiplication = () => {
    handleCalculation(3);
  };

  const handleDivision = () => {
    handleCalculation(4);
  };

  const handleSquareRoot = () => {
    handleCalculation(5);
  };

  const handleRandomString = async () => {
    const url = 'http://localhost:8080/api/v1/calculator/arithmeticOperation';
    const token = getToken();
    const operationData = {
      operationId: 6
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(operationData)
      });

      if (response.ok) {
        const randomString = await response.text();
        console.log(randomString);
        setResult(`Random String: ${JSON.parse(randomString).result}`);
      } else {
        setResult('Error occurred during random string generation');
      }
    } catch (error) {
      setResult('Error occurred during random string generation');
      console.error('Error occurred during random string generation:', error);
    }
  };

  const handleLogoutClick = () => {
    handleLogout(); 
    navigate('/'); 
  };

  const handleGoToRecords = () => {
    navigate('/records');
  };

  return (
    <div>
      <h2>Calculator</h2>
      <button onClick={handleGoToRecords}>Go to Records</button>
      <button onClick={handleLogoutClick}>Logout</button>
      <div>
        <label htmlFor="num1">Number 1:</label>
        <input type="number" id="num1" value={num1} onChange={handleNum1Change} />
      </div>
      <div>
        <label htmlFor="num2">Number 2:</label>
        <input type="number" id="num2" value={num2} onChange={handleNum2Change} />
      </div>
      <button onClick={handleAddition}>Add</button>
      <button onClick={handleSubtraction}>Subtract</button>
      <button onClick={handleMultiplication}>Multiply</button>
      <button onClick={handleDivision}>Divide</button>
      <button onClick={handleSquareRoot}>Square Root</button>
      <button onClick={handleRandomString}>Generate Random String</button>
      <div>{result}</div>
    </div>
    
  );
};

export default CalculatorPage;
