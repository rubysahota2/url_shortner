import React, { useState } from 'react';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiration, setExpiration] = useState('');
  const [message, setMessage] = useState('');

  const [shortCode, setShortCode] = useState('');
  const [originalUrl, setOriginalUrl] = useState(null);

  const [updateCode, setUpdateCode] = useState('');
  const [updateUrl, setUpdateUrl] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  const [deleteCode, setDeleteCode] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  const handleShorten = async (event) => {
    event.preventDefault();
    const dataToSend = { original_url: longUrl };
    if (customAlias) dataToSend.custom_alias = customAlias;
    if (expiration) dataToSend.expiration = new Date(expiration).toISOString();

    try {
      const response = await fetch('http://localhost:8000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(
          <span>
            Short URL:{' '}
            <a href={data.short_url} target="_blank" rel="noopener noreferrer">
              {data.short_url}
            </a>
          </span>
        );
      } else {
        setMessage(
          Array.isArray(data.detail)
            ? 'Error: ' + data.detail[0].msg
            : 'Error: ' + (data.detail || 'Something went wrong.')
        );
      }
    } catch {
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
    } catch {
      code = shortCode;
    }

    try {
      const response = await fetch(`http://localhost:8000/shorten/${code}/info`);
      const data = await response.json();

      if (response.ok) {
        const expiresText = data.expiration
          ? `Expires at: ${new Date(data.expiration).toLocaleString()}`
          : 'Never expires';

        setOriginalUrl(
          <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '6px' }}>
            <div>
              <strong>Original URL:</strong>{' '}
              <a href={data.original_url} target="_blank" rel="noopener noreferrer">
                {data.original_url}
              </a>
            </div>
            <div><strong>Visits:</strong> {data.visits}</div>
            <div><strong>{expiresText}</strong></div>
          </div>
        );
      } else {
        setOriginalUrl('Short code not found.');
      }
    } catch {
      setOriginalUrl('Error: Could not connect to server.');
    }
  };

  const handleUpdate = async () => {
    if (!updateCode || !updateUrl) {
      setUpdateMessage('Please provide both short code and new destination URL.');
      return;
    }

    let code = updateCode;
    try {
      const url = new URL(updateCode);
      code = url.pathname.replace('/', '');
    } catch {
      code = updateCode;
    }

    try {
      const response = await fetch(`http://localhost:8000/shorten/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url: updateUrl }),
      });

      const data = await response.json();
      setUpdateMessage(
        response.ok ? 'URL updated successfully!' : data.detail || 'Failed to update.'
      );
    } catch {
      setUpdateMessage('Error: Could not connect to server.');
    }
  };

  const handleDelete = async () => {
    if (!deleteCode) {
      setDeleteMessage('Please enter the short code or full short URL.');
      return;
    }

    let code = deleteCode;
    try {
      const url = new URL(deleteCode);
      code = url.pathname.replace('/', '');
    } catch {
      code = deleteCode;
    }

    try {
      const response = await fetch(`http://localhost:8000/shorten/${code}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      setDeleteMessage(
        response.ok ? 'URL deleted successfully.' : data.detail || 'Failed to delete.'
      );
    } catch {
      setDeleteMessage('Error: Could not connect to server.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#0057b8' }}>🔗 URL Shortener</h2>

      {/* Shorten Form */}
      <form onSubmit={handleShorten} style={{ marginBottom: '2rem' }}>
        <h3>Shorten a URL</h3>
        <input
          type="text"
          placeholder="Enter your long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Custom alias (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          style={inputStyle}
        />
        <label style={{ marginTop: '0.5rem' }}>
          Expiration (optional):
          <input
            type="datetime-local"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            style={{ ...inputStyle, marginTop: '0.25rem' }}
          />
        </label>
        <button type="submit" style={buttonStyle}>Shorten</button>
        <div style={messageStyle}>{message}</div>
      </form>

      {/* Lookup */}
      <hr />
      <h3>Find Original URL</h3>
      <input
        type="text"
        placeholder="Short code or full short URL"
        value={shortCode}
        onChange={(e) => setShortCode(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleLookup} style={buttonStyle}>Get URL</button>
      {originalUrl && <div style={{ marginTop: '1rem' }}>{originalUrl}</div>}

      {/* Update */}
      <hr />
      <h3>Update Short URL</h3>
      <input
        type="text"
        placeholder="Short code or full short URL"
        value={updateCode}
        onChange={(e) => setUpdateCode(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="New destination URL"
        value={updateUrl}
        onChange={(e) => setUpdateUrl(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleUpdate} style={buttonStyle}>Update</button>
      <div style={messageStyle}>{updateMessage}</div>

      {/* Delete */}
      <hr />
      <h3>Delete Short URL</h3>
      <input
        type="text"
        placeholder="Short code or full short URL"
        value={deleteCode}
        onChange={(e) => setDeleteCode(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleDelete} style={buttonStyle}>Delete</button>
      <div style={messageStyle}>{deleteMessage}</div>
    </div>
  );
}

const inputStyle = {
  padding: '0.5rem',
  width: '100%',
  marginBottom: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  backgroundColor: '#0057b8',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginBottom: '1rem',
};

const messageStyle = {
  marginTop: '1rem',
  fontWeight: 'bold',
  color: '#333',
};

export default App;
