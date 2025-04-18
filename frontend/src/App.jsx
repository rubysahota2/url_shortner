import React, { useState } from 'react';

function App() {

  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [message, setMessage] = useState('');

  const [shortCode, setShortCode] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');

  const [updateCode, setUpdateCode] = useState('');
  const [updateUrl, setUpdateUrl] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  const [deleteCode, setDeleteCode] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  const handleShorten = async (event) => {
    event.preventDefault();

    const dataToSend = { original_url: longUrl };
    if (customAlias) dataToSend.custom_alias = customAlias;

    try {
      const response = await fetch('http://localhost:8000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Short URL: ' + data.short_url);
      } else {
        setMessage('Error: ' + (data.detail || 'Something went wrong.'));
      }
    } catch (error) {
      setMessage('Error: Could not connect to server.');
    }
  };

  const handleLookup = async () => {
    if (!shortCode) {
      setOriginalUrl('Please enter a short code or short URL.');
      return;
    }

    let code = shortCode;
    try {
      const url = new URL(shortCode);
      code = url.pathname.replace('/', '');
    } catch (e) {
      code = shortCode;
    }

    try {
      const response = await fetch(`http://localhost:8000/shorten/${code}/info`);
      const data = await response.json();

      if (response.ok) {
        setOriginalUrl('Original URL: ' + data.original_url);
      } else {
        setOriginalUrl('Short code not found.');
      }
    } catch (error) {
      setOriginalUrl('Error: Could not connect to server.');
    }
  };

  const handleUpdate = async () => {
    if (!updateCode || !updateUrl) {
      setUpdateMessage("Please provide both short code or URL and new destination URL.");
      return;
    }

    let code = updateCode;
    try {
      const url = new URL(updateCode);
      code = url.pathname.replace('/', '');
    } catch (e) {
      code = updateCode;
    }

    try {
      const response = await fetch(`http://localhost:8000/shorten/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url: updateUrl })
      });

      const data = await response.json();
      if (response.ok) {
        setUpdateMessage("URL updated successfully!");
      } else {
        setUpdateMessage(data.detail || "Failed to update.");
      }
    } catch (error) {
      setUpdateMessage("Error: Could not connect to server.");
    }
  };

  const handleDelete = async () => {
    if (!deleteCode) {
      setDeleteMessage("Please enter the short code or full short URL.");
      return;
    }

    let code = deleteCode;
    try {
      const url = new URL(deleteCode);
      code = url.pathname.replace('/', '');
    } catch (e) {
      code = deleteCode;
    }

    try {
      const response = await fetch(`http://localhost:8000/shorten/${code}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (response.ok) {
        setDeleteMessage("URL deleted successfully.");
      } else {
        setDeleteMessage(data.detail || "Failed to delete.");
      }
    } catch (error) {
      setDeleteMessage("Error: Could not connect to server.");
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

      <hr style={{ margin: '2rem 0' }} />
      <h3>Find Original URL</h3>
      <input
        type="text"
        placeholder="Enter short code or URL"
        value={shortCode}
        onChange={(e) => setShortCode(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleLookup}>Get URL</button>
      <div style={{ marginTop: '1rem' }}>{originalUrl}</div>

      <hr style={{ margin: '2rem 0' }} />
      <h3>Update Short URL</h3>
      <input
        type="text"
        placeholder="Short code or full short URL"
        value={updateCode}
        onChange={(e) => setUpdateCode(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <input
        type="text"
        placeholder="New destination URL"
        value={updateUrl}
        onChange={(e) => setUpdateUrl(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleUpdate}>Update</button>
      <div style={{ marginTop: '1rem' }}>{updateMessage}</div>

      <hr style={{ margin: '2rem 0' }} />
      <h3>Delete Short URL</h3>
      <input
        type="text"
        placeholder="Short code or full short URL"
        value={deleteCode}
        onChange={(e) => setDeleteCode(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleDelete}>Delete</button>
      <div style={{ marginTop: '1rem' }}>{deleteMessage}</div>
    </div>
  );
}

export default App;
