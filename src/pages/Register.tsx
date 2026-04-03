import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { RegisterRequest } from '../types/auth';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  cccd: z.string().min(9, 'CCCD/ID must be valid'),
  phone: z.string().min(9, 'Phone number must be at least 9 digits')
});

export const Register: React.FC = () => {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');
    try {
      const response = await authService.register(data);
      setSuccessMessage(response.message || 'Registration successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel" style={{ maxWidth: '540px' }}>
        <h2 className="text-center">Create an Account</h2>
        <p className="text-center mb-6 text-muted">Join us to protect your sensitive data</p>
        
        {serverError && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--error-color)', fontSize: '0.9rem', textAlign: 'center' }}>
            {serverError}
          </div>
        )}

        {successMessage && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--success-color)', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
            {successMessage} Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              id="fullName" 
              type="text" 
              className={`input-field ${errors.fullName ? 'input-error' : ''}`}
              placeholder="Enter your full name"
              {...register('fullName')}
            />
            {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
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

            <div className="input-group" style={{ flex: 1 }}>
              <label htmlFor="phone">Phone Number</label>
              <input 
                id="phone" 
                type="text" 
                className={`input-field ${errors.phone ? 'input-error' : ''}`}
                placeholder="Phone number"
                {...register('phone')}
              />
              {errors.phone && <span className="error-message">{errors.phone.message}</span>}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="cccd">CCCD / National ID</label>
            <input 
              id="cccd" 
              type="text" 
              className={`input-field ${errors.cccd ? 'input-error' : ''}`}
              placeholder="Your national ID"
              {...register('cccd')}
            />
            {errors.cccd && <span className="error-message">{errors.cccd.message}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              className={`input-field ${errors.password ? 'input-error' : ''}`}
              placeholder="Create a password (min 8 chars)"
              {...register('password')}
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn-primary mt-4" disabled={isLoading || !!successMessage}>
            {isLoading ? <div className="spinner"></div> : 'Register Account'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
