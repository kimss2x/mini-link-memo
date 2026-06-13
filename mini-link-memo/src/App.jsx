
import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [category, setCategory] = useState('Article');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedLinks = localStorage.getItem('links');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
  }, [links]);

  const addLink = (e) => {
    e.preventDefault();
    if (!title || !url) {
      alert('Title and URL are required.');
      return;
    }
    const newLink = {
      id: Date.now(),
      title,
      url,
      memo,
      category,
      createdAt: new Date().toLocaleDateString(),
    };
    setLinks([newLink, ...links]);
    setTitle('');
    setUrl('');
    setMemo('');
    setCategory('Article');
  };

  const deleteLink = (id) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.memo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <h1>Mini Link Memo</h1>
      </header>
      <main>
        <form onSubmit={addLink} className="add-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <textarea
            placeholder="Memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          ></textarea>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Article">Article</option>
            <option value="Instagram">Instagram</option>
            <option value="Blog">Blog</option>
            <option value="YouTube">YouTube</option>
            <option value="Reference">Reference</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit">Add Link</button>
        </form>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="link-cards">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => (
              <div key={link.id} className="card">
                <div className="card-header">
                  <h3>{link.title}</h3>
                  <span className="category">{link.category}</span>
                </div>
                <div className="card-body">
                  <p>{link.memo}</p>
                  <div className="card-actions">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      Open Link
                    </a>
                    <button onClick={() => copyUrl(link.url)}>Copy URL</button>
                    <button onClick={() => deleteLink(link.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="card-footer">
                  <small>Created: {link.createdAt}</small>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No links saved yet. Add a new link to get started!</p>
            </div>
          )}
        </div>
      </main>
      <footer>
        <p>Built by Noah</p>
      </footer>
    </div>
  );
};

export default App;
