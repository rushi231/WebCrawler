import { useState, useEffect } from 'react';
import axios from 'axios';

const UserManage = ({ token, user }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 

  const getUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    }  
    setLoading(false);
    
  };

  useEffect(() => {
    getUsers();
  }, []);

   if (!user || user.role !== 'Admin'){

        return null
   }


  const Delete = async (id) => {
    if (!window.confirm('Delete User?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const blockUser = async (id, isBlocked) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/auth/users/${id}/block`,
        { block: !isBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getUsers();
    } catch (err) {
      alert(err.message || 'Failed to block.');
    }
  };

  const updateRole = async (id, newRole) => {
    if (newRole != 'User' && newRole != 'Admin') {
      return;
    }
    
    try {
      await axios.patch(
        `http://localhost:5000/api/auth/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      getUsers();

    } catch (err) {
      alert(err.message || 'Failed to update user');
    }
};

return (
  <div className="user-cont">
    <h1> Users</h1>
    {loading && <p> Loading the Users</p>}
    {error && <div className="errormessage">{error}</div>}

    {users.length > 0 && (
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map( (u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>
                <select
                  value={u.role || 'User'}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </td>
              <td>{u.blocked ? 'Yes' : 'No'}</td>
              <td>
                <button
                  className="blockbutton"
                  onClick={() => blockUser(u.id, u.blocked)}
                >
                  {u.blocked ? 'Unblock' : 'Block'}
                </button>
                <button
                  className="update-user-role"
                  onClick={() => Delete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

}
export default UserManage;