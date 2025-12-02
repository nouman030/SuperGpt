import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Form = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const registerUser = async (userData) => {
    setApiError('');
    setSuccessMessage('');
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (data.Success) {
          setSuccessMessage('Registration successful! Redirecting...');
          
          // Optional: Redirect after a delay
          setTimeout(() => window.location.href = '/login', 2000);
        } else {
          setApiError(data.message || 'Registration failed');
        }
      } else {
        // Handle non-JSON errors (likely 404 or 500 HTML from Express)
        if (response.status === 404) {
          setApiError('API not found (404). Please restart your server to apply fixes.');
        } else {
          setApiError(`Server error: ${response.status} ${response.statusText}`);
        }
        console.error('Non-JSON response received:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
      setApiError('Network error. Is the server running?');
    }
  };


  const validateForm = () => {
    let isValid = true;

    // Username validation
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError('');
    }

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Confirm Password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newUserData = {
        name: username,
        email,
        password
      };
      registerUser(newUserData);
    } else {
      toast.error('Form has errors');
    }
  };

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-[450px] bg-white dark:bg-[var(--color-bg-secondary)] p-8 rounded-[20px] relative shadow-xl transition-colors duration-300">
      <form className="flex flex-col gap-2.5" onSubmit={handleSubmit} noValidate>
        <p className="text-[28px] text-[var(--color-accent)] font-semibold tracking-[-1px] relative flex items-center pl-[30px]">
          <span className="absolute left-0 w-[18px] h-[18px] bg-[var(--color-accent)] rounded-full"></span>
          <span className="absolute left-0 w-[18px] h-[18px] bg-[var(--color-accent)] rounded-full animate-ping opacity-75"></span>
          Register
        </p>
        <p className="text-[rgba(88,87,87,0.822)] dark:text-[var(--color-text-secondary)] text-sm">
          Signup now and get full access to our app.
        </p>
        
        {apiError && (
          <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-lg">
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="p-3 text-sm text-green-500 bg-green-100 border border-green-200 rounded-lg">
            {successMessage}
          </div>
        )}

        <label className="relative">
          <input
            required
            placeholder=" "
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`peer w-full p-[10px_10px_20px_10px] outline-none border rounded-[10px] bg-transparent text-[var(--color-text-primary)] transition-colors duration-300 focus:border-[var(--color-accent)] ${
              usernameError ? 'border-red-500' : 'border-[var(--color-border)] valid:border-green-500'
            }`}
          />
          <span
            className={`absolute left-[10px] top-[15px] text-gray-500 text-[0.9em] cursor-text transition-all duration-300 peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[0.9em] peer-focus:top-[30px] peer-focus:text-[0.7em] peer-focus:font-semibold pointer-events-none ${
              usernameError ? 'text-red-500' : 'peer-valid:top-[30px] peer-valid:text-[0.7em] peer-valid:font-semibold peer-valid:text-green-500'
            }`}
          >
            Username
          </span>
          {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
        </label>
        <label className="relative">
          <input
            required
            placeholder=" "
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`peer w-full p-[10px_10px_20px_10px] outline-none border rounded-[10px] bg-transparent text-[var(--color-text-primary)] transition-colors duration-300 focus:border-[var(--color-accent)] ${
              emailError ? 'border-red-500' : 'border-[var(--color-border)] valid:border-green-500'
            }`}
          />
          <span
            className={`absolute left-[10px] top-[15px] text-gray-500 text-[0.9em] cursor-text transition-all duration-300 peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[0.9em] peer-focus:top-[30px] peer-focus:text-[0.7em] peer-focus:font-semibold pointer-events-none ${
              emailError ? 'text-red-500' : 'peer-valid:top-[30px] peer-valid:text-[0.7em] peer-valid:font-semibold peer-valid:text-green-500'
            }`}
          >
            Email
          </span>
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </label>
        <label className="relative">
          <input
            required
            placeholder=" "
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`peer w-full p-[10px_10px_20px_10px] outline-none border rounded-[10px] bg-transparent text-[var(--color-text-primary)] transition-colors duration-300 focus:border-[var(--color-accent)] ${
              passwordError ? 'border-red-500' : 'border-[var(--color-border)] valid:border-green-500'
            }`}
          />
          <span
            className={`absolute left-[10px] top-[15px] text-gray-500 text-[0.9em] cursor-text transition-all duration-300 peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[0.9em] peer-focus:top-[30px] peer-focus:text-[0.7em] peer-focus:font-semibold pointer-events-none ${
              passwordError ? 'text-red-500' : 'peer-valid:top-[30px] peer-valid:text-[0.7em] peer-valid:font-semibold peer-valid:text-green-500'
            }`}
          >
            Password
          </span>
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </label>
        <label className="relative">
          <input
            required
            placeholder=" "
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`peer w-full p-[10px_10px_20px_10px] outline-none border rounded-[10px] bg-transparent text-[var(--color-text-primary)] transition-colors duration-300 focus:border-[var(--color-accent)] ${
              confirmPasswordError ? 'border-red-500' : 'border-[var(--color-border)] valid:border-green-500'
            }`}
          />
          <span
            className={`absolute left-[10px] top-[15px] text-gray-500 text-[0.9em] cursor-text transition-all duration-300 peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[0.9em] peer-focus:top-[30px] peer-focus:text-[0.7em] peer-focus:font-semibold pointer-events-none ${
              confirmPasswordError ? 'text-red-500' : 'peer-valid:top-[30px] peer-valid:text-[0.7em] peer-valid:font-semibold peer-valid:text-green-500'
            }`}
          >
            Confirm password
          </span>
          {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
        </label>
        <button type="submit" className="border-none outline-none bg-[var(--color-accent)] p-2.5 rounded-[10px] text-white text-base hover:bg-[var(--color-accent-hover)] transition-colors duration-300 cursor-pointer">
          Submit
        </button>
        <p className="text-[rgba(88,87,87,0.822)] dark:text-[var(--color-text-secondary)] text-sm text-center">
          Already have an account ? <a href="/log-in" className="text-[var(--color-accent)] hover:underline">Signin</a>
        </p>
      </form>
    </div>
  );
};

export default Form;
