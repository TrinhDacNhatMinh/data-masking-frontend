import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest } from '../types/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const Login: React.FC = () => {
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginState } = useAuth();

  const from = location.state?.from?.pathname || '/users';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    setServerError('');
    try {
      const response = await authService.login(data);
      loginState(response);
      navigate(from, { replace: true });
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <h2 className="text-center">Welcome Back</h2>
        <p className="text-center mb-6 text-muted">Sign in to your account</p>
        
        {serverError && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--error-color)', fontSize: '0.9rem', textAlign: 'center' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter your email"
              {...register('email')}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              className={`input-field ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};
