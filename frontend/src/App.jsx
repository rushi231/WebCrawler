import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/header';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import CrawlerForm from './components/form';
import CrawlResultsTable from './components/ResultsTable';
import UserManage from './components/UserControll';
import './App.css';
import './index.css';


function App() {
  const [page, setCurrentPage] = useState('signin');
  const [user, setUser] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');

  const SignIN_done = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const SignUP_done = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const handleCrawl = async (url, maxPages = 50) => {
    setError('');
    setLoading(true);
    setResults(null);


    try {
      const response = await axios.post(
        'http://localhost:5000/api/crawl',
        { url, maxPages },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      setResults(response.data);
    } catch (err) {
      setError(err.message || 'Crawl failed');
    } 
    setLoading(false);
    
  };

  // logout handler
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setResults(null);
    setCurrentPage('signin');
  };

  if (page === 'signin') {
  return <SignIn onSigninSuccess={SignIN_done} setCurrentPage={setCurrentPage} />;
}

  if (page === 'signup') {
  return <SignUp onSignupSuccess={SignUP_done} setCurrentPage={setCurrentPage} />;
}

  if (page === 'UserManage') {
    return (
      <main>
        <div className="app">
          <Header/>

          <div className="userinfo">
            <p>Hi, {user.username} ({user.role})</p>
              <button onClick={() => setCurrentPage('dashboard')} className = 'nav-button'>Back to Dashboard</button>
              <button onClick={handleLogout} className="logoutbutton"> Logout </button>
          </div>
          <UserManage token={token} user={user}/>
      
        </div>
      </main>
    );
  }

  return (
    <div className="app">
      <Header />

      <main>
        <div className="userinfo">
          <span>Hi, {user? user.username: 'Guest'} ({user? user.role: 'N/A'})</span>

          {user && user.role === 'Admin' && (
            <button  onClick={() => setCurrentPage('UserManage')} className="button-admin">
              Manage Users
            </button>
          )}

          {user && (
            <button onClick={handleLogout} className="logoutbutton">
              Logout
            </button>
          )}
        </div>

        <CrawlerForm  onSubmit={handleCrawl} loading={loading} user = {user} />

        {error && <div className="errormessage">{error}</div>}

        {results ? (<CrawlResultsTable results={results} user={user} token = {token} onDelete = {() => setResults(null)} />
        ) : (
          <p className="no-results">No crawl results yet.</p>
        )}

  
      </main>
    </div>
  );
}

export default App;