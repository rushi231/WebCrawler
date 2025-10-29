import { useState } from 'react';
import axios from 'axios';

const SignUp = ({onSignupSuccess,  setCurrentPage}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and Password is required.');
      return;
    }

    if (password.length < 5) {
      setError('Password is too short.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        password,
        role
      });

      onSignupSuccess(response.data.token, response.data.user);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signuppage">
      
      <div className="signin-left">
        <h1>Webcrawler</h1>
      </div>

    
      <div className="signin-page">
        <div className="signin-box">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter username'
                disabled={loading}
              />
            </div>

            <div className="form-section">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 5 characters)"
                disabled={loading}
              />
            </div>

            <div className="form-section">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {error && <div className="error-text">{error}</div>}

            <button type="submit" disabled={loading} className="signin-button">
              {loading ? 'Creating Account' : 'Sign Up'}
            </button>
          </form>

          <div className="switchpage">
            <p>
              Already have an account?{' '}
              <button onClick={() => setCurrentPage('signin')}>Sign In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;