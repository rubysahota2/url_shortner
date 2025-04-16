import React, { useState } from 'react';

function App() {

  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [message, setMessage] = useState('');

  const handleShorten = async (event) => {
    event.preventDefault();

    const requestData = {
      original_url: longUrl
    };

    if (customAlias) {
      requestData.custom_alias = customAlias;
    }

    try {

      const response = await fetch('http://localhost:8000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Short URL: ' + data.short_url); // Show the result
      } else {
        setMessage('Error: ' + (data.detail || 'Something went wrong.'));
      }
    } catch (error) {
      setMessage('Error: Failed to connect to server.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Simple URL Shortener</h2>
      <form onSubmit={handleShorten}>
        <input
          type="text"
          placeholder="Enter your long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={{ marginRight: '1rem', width: '300px' }}
        />
        <input
          type="text"
          placeholder="Custom short name (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <button type="submit">Shorten</button>
      </form>
      <div style={{ marginTop: '1rem' }}>{message}</div>
    </div>
  );
}

export default App;
