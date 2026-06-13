import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './index.css';

// SVG Icons as React Components for better control
const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
);

// Weather Widget Component
const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current_weather=true');
      if (!response.ok) {
        throw new Error('Failed to fetch weather data.');
      }
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const getWeatherEmoji = (code) => {
    const codes = {
        0: '☀️', 1: '🌤️', 2: '⛅️', 3: '☁️', 45: '🌫️', 48: '🌫️',
        51: '🌦️', 53: '🌦️', 55: '🌦️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
        80: '🌦️', 81: '🌦️', 82: '⛈️', 95: '⛈️',
    };
    return codes[code] || '🤷‍♀️';
  };

  return (
    <div className="card weather-widget">
      <div className="weather-header">
        <h3>Today's Tiny Weather</h3>
        <button onClick={fetchWeather} className="action-btn refresh-btn" disabled={loading}>
          <RefreshIcon />
        </button>
      </div>
      {loading && <div className="weather-content"><p>Loading...</p></div>}
      {error && <div className="weather-content error-state"><p>Error: {error}</p></div>}
      {weather && !loading && (
        <div className="weather-content">
          <div className="weather-item temp">{getWeatherEmoji(weather.weathercode)} {weather.temperature}°C</div>
          <div className="weather-item">Wind: {weather.windspeed} km/h</div>
        </div>
      )}
    </div>
  );
};

// Data Management Component
const DataManagement = ({ links, setLinks }) => {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    if (links.length === 0) {
        alert('No links to export!');
        return;
    }
    const dataStr = JSON.stringify(links, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mini-link-memo-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedLinks = JSON.parse(e.target.result);
        // Basic validation
        if (Array.isArray(importedLinks)) {
            setLinks(importedLinks);
            alert('Links imported successfully!');
        } else {
            throw new Error('Invalid file format.');
        }
      } catch (error) {
        alert(`Failed to import links: ${error.message}`);
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = null;
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL links? This action cannot be undone.')) {
      setLinks([]);
      alert('All links have been cleared.');
    }
  };

  return (
    <div className="card data-management-card">
      <h2>Data Management</h2>
      <div className="data-actions-grid">
        <button onClick={handleExport} className="btn btn-secondary">
          Export JSON
        </button>
        <button onClick={() => fileInputRef.current.click()} className="btn btn-secondary">
          Import JSON
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".json"
          style={{ display: 'none' }}
        />
        <button onClick={handleClearAll} className="btn btn-danger">
          Clear All
        </button>
      </div>
    </div>
  );
};

function App() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(null);

  useEffect(() => {
    const savedLinks = localStorage.getItem('links');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
  }, [links]);

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!title || !url) return;
    const newLink = { id: Date.now(), title, url, category };
    setLinks([...links, newLink]);
    setTitle('');
    setUrl('');
    setCategory('');
  };

  const handleDeleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredLinks = useMemo(() => {
    return links.filter(link =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [links, searchTerm]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mini Link Memo</h1>
        <p>A cozy little place to collect links, ideas, and inspiration.</p>
      </header>

      <main className="main-content">
        <WeatherWidget />

        <div className="card form-card">
          <form onSubmit={handleAddLink}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Awesome React Hooks"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="url">URL</label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., https://reactjs.org"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category (Optional)</label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Tech, Design"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              ✨ Add Link
            </button>
          </form>
        </div>

        <div className="search-bar">
           <SearchIcon />
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="links-grid">
          {filteredLinks.length > 0 ? (
            filteredLinks.map(link => (
              <div key={link.id} className="link-card">
                <div className="link-card-header">
                  {link.category && <span className="category-badge">{link.category}</span>}
                </div>
                <div className="link-card-body">
                  <h3>{link.title}</h3>
                </div>
                <div className="link-card-actions">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="action-btn">
                    <LinkIcon />
                  </a>
                  <button onClick={() => handleCopyUrl(link.url)} className="action-btn">
                     {copiedUrl === link.url ? 'Copied!' : <CopyIcon />}
                  </button>
                  <button onClick={() => handleDeleteLink(link.id)} className="action-btn btn-delete">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>Your creative journey starts here. Add a link to begin!</p>
            </div>
          )}
        </div>

        <DataManagement links={links} setLinks={setLinks} />

        {/* Feedback Form Section */}
        <div className="card form-card">
          <h2>Send Feedback 💌</h2>
          {/* 
            Connect this form to Formspree.
            1. Create a new form on formspree.io.
            2. Get your form's ID from the endpoint URL (e.g., https://formspree.io/f/YOUR_FORM_ID).
            3. Replace 'YOUR_FORM_ID' in the action URL below.
          */}
          <form action="https://formspree.io/f/mvznvwkk" method="POST">
            <div className="form-group">
              <label htmlFor="feedback-name">Your Name</label>
              <input
                id="feedback-name"
                type="text"
                name="name"
                placeholder="Noah"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="feedback-email">Your Email</label>
              <input
                id="feedback-email"
                type="email"
                name="email"
                placeholder="noah@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="feedback-message">Your Message</label>
              <textarea
                id="feedback-message"
                name="message"
                rows="4"
                placeholder="I love this app!"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Send Feedback
            </button>
          </form>
          <p className="form-note">
            Send a tiny note, bug report, or idea.
          </p>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built by Noah · Deployed on Cloudflare Pages</p>
      </footer>
    </div>
  );
}

export default App;
