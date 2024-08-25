import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const response = await axios.post('https://bfhl-backend-ahnm.onrender.com/bfhl', {
        data: parsedData.data
      });

      setResponseData(response.data);
    } catch (error) {
      alert('Invalid JSON or error in API request');
      console.error(error);
    }
  };

  const handleDropdownChange = (event) => {
    const { options } = event.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
    let result = [];

    if (selectedOptions.includes('Numbers') && numbers) {
      result.push(<div key="numbers">Numbers: {numbers.join(', ')}</div>);
    }
    if (selectedOptions.includes('Alphabets') && alphabets) {
      result.push(<div key="alphabets">Alphabets: {alphabets.join(', ')}</div>);
    }
    if (selectedOptions.includes('Highest lowercase alphabet') && highest_lowercase_alphabet) {
      result.push(
        <div key="highest_lowercase_alphabet">
          Highest lowercase alphabet: {highest_lowercase_alphabet.join(', ')}
        </div>
      );
    }

    return result;
  };

  return (
    <div className="container">
      <h1>Your Roll Number</h1>
      <textarea
        rows="5"
        cols="50"
        placeholder='Enter JSON (e.g., { "data": ["UserID", "EmailID", "RollNo"] })'
        value={jsonInput}
        onChange={handleInputChange}
      />
      <br />
      <button onClick={handleSubmit}>Submit JSON</button>

      {responseData && (
        <div>
          <h2>Select Data to Display</h2>
          <select multiple onChange={handleDropdownChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          <div className="result-container">{renderResponse()}</div>
        </div>
      )}
    </div>
  );
}

export default App;
