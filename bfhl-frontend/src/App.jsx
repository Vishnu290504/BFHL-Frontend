import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const parsedData = JSON.parse(jsonInput);
      const response = await axios.post('https://bfhl-backend-ahnm.onrender.com/bfhl', {
        data: parsedData.data
      });
      setResponseData(response.data);
    } catch (error) {
      alert('Invalid JSON or error in API request');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownChange = (event) => {
    const { options } = event.target;
    const selected = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
    const resultMap = {
      'Numbers': numbers,
      'Alphabets': alphabets,
      'Highest lowercase alphabet': highest_lowercase_alphabet
    };

    return selectedOptions.map(option => (
      <div key={option} className="result-item">
        <h3>{option}</h3>
        <p>{resultMap[option]?.join(', ') || 'N/A'}</p>
      </div>
    ));
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="title">21BDS0073</h1>
        <div className="input-section">
          <textarea
            className="json-input"
            rows="5"
            placeholder='Enter JSON (e.g., { "data": ["UserID", "EmailID", "RollNo"] })'
            value={jsonInput}
            onChange={handleInputChange}
          />
          <button className="submit-button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Analyze Data'}
          </button>
        </div>

        {responseData && (
          <div className="results-section">
            <h2>Select Data to Display</h2>
            <select 
              multiple 
              onChange={handleDropdownChange}
              className="data-select"
            >
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
            </select>
            <div className="result-container">{renderResponse()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
