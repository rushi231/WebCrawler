import { useState } from "react";

function CrawlerForm({ onSubmit,  loading,user }) {
  const [url, setUrl] = useState('');
  const [maxPages, setMaxPages] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = (url || '').trim();

    if (!trimmed) {
      alert('Enter URL');
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      alert('Enter a valid URL (must start with http:// or https://)');
      return;
    }

    onSubmit(trimmed, maxPages);
  };

  return (
    <div className="crawler-form-card">
      <h1>Start to Crawl</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Website URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
          />
        </div>

        {user?.role === 'Admin' && (
          <div className="form-group">
            <label htmlFor="maxPages">Max Pages to Crawl:</label>
            <input
              type="number"
              id="maxPages"
              value={maxPages}
              onChange={(e) => setMaxPages(parseInt(e.target.value) || 50)}
              min="1"
              max="500"
              
              disabled={loading}
            />
          </div>
        )}



        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Crawling' : 'Start Crawling'}
        </button>
      </form>
    </div>
  );
}

export default CrawlerForm;