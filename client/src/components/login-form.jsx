import React, { useState } from 'react';

const InputField = ({ id, label, type, value, onChange, error }) => {
  return (
    <label htmlFor={id} className="relative">
      <input
        id={id}
        required
        placeholder=" "
        type={type}
        value={value}
        onChange={onChange}
        className={`peer w-full p-[10px_10px_20px_10px] outline-none border rounded-[10px] bg-transparent text-[var(--color-text-primary)] transition-colors duration-300 focus:border-[var(--color-accent)] valid:border-green-500 text-base
          ${error ? 'border-red-500' : 'border-[var(--color-border)]'}
        `}
      />
      <span
        className={`absolute left-[10px] top-[15px] text-[0.9em] cursor-text transition-all duration-300 peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[0.9em] peer-focus:top-[30px] peer-focus:text-[0.7em] peer-focus:font-semibold peer-valid:top-[30px] peer-valid:text-[0.7em] peer-valid:font-semibold pointer-events-none
          ${error ? 'text-red-500 peer-focus:text-red-500 peer-valid:text-red-500' : 'text-gray-500 peer-valid:text-green-500'}
        `}
      >
        {label}
      </span>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </label>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required.';
    } else if (!re.test(email)) {
      return 'Invalid email format.';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required.';
    } else if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail));
    setApiError(''); // Clear API error on input change
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    setApiError(''); // Clear API error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(''); // Clear previous API errors

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (emailValidation || passwordValidation) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.Success) {
        
        localStorage.setItem('token', data.token);
        // Optional: Redirect after a delay
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        console.error('Login failed:', data.message);
        setApiError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setApiError('Network error or server is unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[420px] w-full bg-white dark:bg-[var(--color-bg-secondary)] p-8 rounded-[20px] relative shadow-lg transition-colors duration-300">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <p className="text-[28px] text-[var(--color-accent)] font-semibold tracking-[-1px] relative flex items-center pl-[30px] mb-2">
          <span className="absolute left-0 w-[18px] h-[18px] bg-[var(--color-accent)] rounded-full"></span>
          <span className="absolute left-0 w-[18px] h-[18px] bg-[var(--color-accent)] rounded-full animate-ping opacity-75"></span>
          Login
        </p>
        <p className="text-[rgba(88,87,87,0.822)] dark:text-[var(--color-text-secondary)] text-sm mb-2">
          Login to your account to continue.
        </p>
        <InputField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
        />
        {apiError && <p className="text-red-500 text-xs mt-1 text-center">{apiError}</p>}
        <button
          type="submit"
          className="border-none outline-none bg-[var(--color-accent)] p-3 rounded-[12px] text-white text-lg font-medium hover:bg-[var(--color-accent-hover)] transition-colors duration-300 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-[rgba(88,87,87,0.822)] dark:text-[var(--color-text-secondary)] text-sm text-center mt-2">
          Don't have an account ? <a href="/sign-up" className="text-[var(--color-accent)] hover:underline">Signup</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
