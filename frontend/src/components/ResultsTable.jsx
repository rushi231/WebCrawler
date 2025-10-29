import React from 'react';
import axios from 'axios';
function CrawlResultsTable({ results, user, token, onDelete }) {
    if (!results) return null;
    // check if isArray
    const urls = Array.isArray(results.urls) ? results.urls : [];

    const deleteResults = async () => {
    if (window.confirm('Are you sure you want to delete the results?')) {
      try {
        await axios.delete(
          'http://localhost:5000/api/results',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        onDelete();
      } catch (err) {
        alert('Can not delete the results');
      }
    }
  };

  return (
    <div className="crawling">
      <header className="header">
        <div className="results-header-top">
          <h1>Crawling Results</h1>
          {user?.role === 'Admin' && (
            <button onClick={deleteResults} className="delete-btn">
              Delete Results
            </button>
          )}
        </div>
        <div className="summary">
          <p>Total pages: {results.totalPages}</p>
          <p>User: {user?.username ?? 'Unknown'} ({user?.role ?? 'N/A'})</p>
        </div>
      </header>
            
            <div className="table">
                <h2> URLS:</h2>
                <ul className="url-lists">
                    {urls.map((url, index) => (
                        <li key={index}>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                {url}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default CrawlResultsTable;