import React, { useState } from 'react';

const Form = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const newUserData = {
    username,
    email,
    password
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
      // Form is valid, proceed with submission (e.g., API call)
      console.log('Form submitted successfully:', { username, email, password });
      // Reset form or redirect
    } else {
      console.log('Form has errors');
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
          Already have an account ? <a href="/login" className="text-[var(--color-accent)] hover:underline">Signin</a>
        </p>
      </form>
    </div>
  );
};

export default Form;
