'''import React, { useState, useEffect, useMemo } from 'react';
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
        <p>Save your favorite links, ideas, and references.</p>
      </header>

      <main className="main-content">
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

        <div className="card search-card">
          <div className="search-bar">
             <SearchIcon />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              <p>No links saved yet. Add one above! 📝</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built by Noah · Deployed on Cloudflare Pages</p>
      </footer>
    </div>
  );
}

export default App;
''