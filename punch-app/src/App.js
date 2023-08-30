import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchData, setPunchData] = useState({});

  const handlePunch = () => {
    if (!isPunchedIn) {
      // Punching in
      setPunchData((prevData) => ({
        ...prevData,
        [username]: {
          status: 'Punched In',
          punchInTime: new Date().getTime(),
          punchOutTime: null
        }
      }));
    } else {
      // Punching out
      setPunchData((prevData) => ({
        ...prevData,
        [username]: {
          ...prevData[username],
          status: 'Punched Out',
          punchOutTime: new Date().getTime()
        }
      }));
    }

    setIsPunchedIn(!isPunchedIn);
  };

  useEffect(() => {
    // Load punch data from localStorage when the app starts
    const storedPunchData = localStorage.getItem('punchData');
    if (storedPunchData) {
      setPunchData(JSON.parse(storedPunchData));
    }
  }, []);

  useEffect(() => {
    // Save punch data to localStorage whenever it changes
    localStorage.setItem('punchData', JSON.stringify(punchData));
  }, [punchData]);

  const calculateTimeDifference = (punchInTime, punchOutTime) => {
    if (!punchInTime || !punchOutTime) {
      return 0;
    }
    return (punchOutTime - punchInTime) / 1000; // Convert to seconds
  };

  return (
    <div className="App">
      <h1>Punch App</h1>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <button onClick={handlePunch}>
        {isPunchedIn ? 'Punch Out' : 'Punch In'}
      </button>
      <div>
        {punchData[username] && (
          <p>
            {username} is currently {punchData[username].status}.
            {punchData[username].status === 'Punched In' &&
              ` Punched in since: ${new Date(punchData[username].punchInTime).toLocaleString()}`}
            {punchData[username].status === 'Punched Out' &&
              ` Total time punched in: ${calculateTimeDifference(
                punchData[username].punchInTime,
                punchData[username].punchOutTime
              )} seconds`}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
