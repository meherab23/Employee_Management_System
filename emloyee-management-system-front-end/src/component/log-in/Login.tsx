import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

interface LoginFormProps {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  errorMessage: string;
  successMessage: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormProps>({ username: '', password: '', rememberMe: false });
  const [error, setError] = useState<LoginErrors>({ errorMessage: '', successMessage: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const { username, password } = formData;
    const demoUsername = 'meherab';
    const demoPassword = '1234';

    if (username === demoUsername && password === demoPassword) {
      setError({ errorMessage: '', successMessage: 'Login successful!' });
      if (formData.rememberMe) {
        localStorage.setItem('username', username);
      }
      setTimeout(() => {
        navigate('/employee-list'); 
      }, 1500);
    } else {
      setError({ errorMessage: 'Invalid username or password', successMessage: '' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <p className="welcome-message">Welcome back! Please log in to continue.</p>
        
        {error.errorMessage && <div className="error-message">{error.errorMessage}</div>}
        {error.successMessage && <div className="success-message">{error.successMessage}</div>}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-options">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
