import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import type { UserResponse } from '../types/user';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logoutState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      if (err.response?.status === 401) {
        logoutState();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutState();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <div>
          <h2 style={{ marginBottom: '0.2rem' }}>User Directory</h2>
          <p className="text-muted">Currently logged in as: <strong>{user?.email}</strong> <span className={`badge ${user?.role === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-user'}`} style={{ marginLeft: '0.5rem' }}>{user?.role?.replace('ROLE_', '')}</span></p>
        </div>
        <button 
          onClick={handleLogout} 
          style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 500, color: '#475569', transition: 'all 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          Sign Out
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {error && (
          <div style={{ padding: '1.5rem', color: 'var(--error-color)', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
            <div className="spinner" style={{ borderColor: 'rgba(79, 70, 229, 0.2)', borderTopColor: 'var(--primary-color)' }}></div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>CCCD / ID</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ background: u.isOwner ? 'rgba(79, 70, 229, 0.03)' : 'transparent' }}>
                    <td style={{ color: 'var(--text-muted)' }}>#{u.id}</td>
                    <td style={{ fontWeight: 500 }}>{u.fullName}</td>
                    
                    {/* Display clear text if owner, masked if not */}
                    <td style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      {u.isOwner ? <span style={{ color: 'var(--primary-color)' }}>{u.email}</span> : u.maskedEmail}
                    </td>
                    
                    <td style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      {u.isOwner ? <span style={{ color: 'var(--primary-color)' }}>{u.phone}</span> : u.maskedPhone}
                    </td>
                    
                    <td style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      {u.isOwner ? <span style={{ color: 'var(--primary-color)' }}>{u.cccd}</span> : u.maskedCccd}
                    </td>
                    
                    <td>
                      <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                        {u.role ? u.role.replace('ROLE_', '') : 'USER'}
                      </span>
                    </td>
                    
                    <td>
                      {u.isOwner && (
                        <span className="badge badge-owner">YOU (Unmasked)</span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && !error && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
