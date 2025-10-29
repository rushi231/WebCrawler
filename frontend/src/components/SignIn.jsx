import { useState } from 'react';
import axios from 'axios';

function SignIn({ onSigninSuccess, setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!username || !password) {
      setMessage('Username and password are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        username,
        password,
      });

      // Call callback provided by parent
      onSigninSuccess && onSigninSuccess(response.data.token, response.data.user);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signinpage">
      
      <div className="signin-left">
        <h1>Webcrawler</h1>
      </div>

     
      <div className="signin-page">
        <div className="signin-box">
          <h2>Welcome Back.</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <label htmlFor="usernameInput">Username</label>
              <input
                type="text"
                id="usernameInput"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-section">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isSubmitting}
              />
            </div>

            {message && <div className="error-text">{message}</div>}

            <button type="submit" disabled={isSubmitting} className="signin-button">
              {isSubmitting ? 'Signing in' : 'Sign In'}
            </button>
          </form>

          <div className="switchpage">
            <p>
              Don’t have an account?{' '}
              <button onClick={() => setCurrentPage('signup')}>Sign Up</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
