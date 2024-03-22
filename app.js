import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './App.css';

function App() {
  //creating currency objects
  const currencySymbols = {
    "usd": '$',
    "eur": '€',
    "gbp": '£',
    "inr": '₹',
    
  };

  //M,B,K value object
  const amountOptions = {
    M: 1e6,
    B: 1e9,
    K: 1e3,
  }

  const [info, setInfo] = useState({});
  const [input, setInput] = useState('');
  const [from, setFrom] = useState('$');
  const [to, setTo] = useState('₹');
  const [options, setOptions] = useState([]);
  const [output, setOutput] = useState(0);

  useEffect(() => {
    Axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`)
      .then((res) => {
        setInfo(res.data[from]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      });
  }, [from]);

  {/*useEffect(() => {
    setOptions(Object.keys(info).map((currency) => currencySymbols[currency]));
    convert();
  }, [info, to]); */}
  
  useEffect(() => {
    setOptions(
      Object.keys(currencySymbols).map((currency) => ({
        value: currency,
        label: `${currencySymbols[currency]} ${currency}`
      }))
    );
    convert();
  }, [to]);

  function convert() {
    const rate = info[to];
    setOutput(parseFloat(input) * rate || 0);
  }

  function flip() {
    const temp = from;
    setFrom(to);
    setTo(temp);
  }

  const handleDropdownChange = (selectedValue, isFromDropdown) => {
    if (isFromDropdown) {
      setFrom(selectedValue);
    } else {
      setTo(selectedValue);
    }
  };

  const handleAmountDropdown = (selectedAmount) => {
    if (input) {
      setInput((parseFloat(input) * selectedAmount).toString());
    }
  };
  
  return (
    <div className="App">
      <div className="heading">
        <h1>Cypher</h1>
      </div>
      <div className="container">
        <div className="left">
          <h3>Amount</h3>
          <input
            type="text"
            placeholder="Enter the amount"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <h3>Value</h3>
          <Dropdown options={Object.keys(amountOptions).map((key) => ({
            value: amountOptions[key],
            label: key,
          }))} onChange={(e) => handleAmountDropdown(e.value)} placeholder="Select" />
        </div>
        <div className="middle">
          <h3>From</h3>
          <Dropdown
            options={options}
            onChange={(e) => 
              handleDropdownChange(e.value, true)
            }
            value={from}
            placeholder="From"
          />
        </div>
        <div className="right">
          <h3>To</h3>
          <Dropdown
            options={options}
            onChange={(e) => handleDropdownChange(e.value, false)}
            value={to}
            placeholder="To"
          />
        </div>
      </div>
      <div className="container">
        <button onClick={convert}>Convert</button>
        <button onClick={flip}>Flip</button>
      </div>
      <div className="result">
        
        <h2>Converted Amount:</h2>
        <p>
          {input} {currencySymbols[from]} =
          {output}{currencySymbols[to]}
          {to}
        </p>
      </div>
      <div className="default-values container">
        <button
          className="default-button left"
          onClick={() => setInput(10e6)}
        >
          10M
        </button>
        <button
          className="default-button middle"
          onClick={() => setInput(50e6)}
        >
          50M
        </button>
        <button
          className="default-button right"
          onClick={() => setInput(250e6)}
        >
          250M
        </button>
      </div>
    </div>
  );
}

export default App;
