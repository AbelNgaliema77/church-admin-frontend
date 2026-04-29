import { useState } from 'react';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { LoginState } from '../../types/api';
import { storeAuth } from './authStorage';
import { login } from './authApi';

type LoginPageProps = {
  onLogin: (auth: LoginState) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('admin@church.local');
  const [password, setPassword] = useState('');
  const [pageError, setPageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submit() {
    if (!email.trim()) {
      setPageError('Email is required.');
      return;
    }

    if (!password.trim()) {
      setPageError('Password is required.');
      return;
    }

    try {
      setIsLoading(true);
      setPageError(null);

      const result = await login({
        email: email.trim(),
        password
      });

      storeAuth(result);
      onLogin(result);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-mark">LB</div>

        <h1>La Borne Church</h1>
        <p>Cape Durbanville Admin Portal</p>

        <ErrorBanner message={pageError} />

        <div className="field">
          <label>Email</label>
          <input
            value={email}
            disabled={isLoading}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@church.local"
          />
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            disabled={isLoading}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                submit();
              }
            }}
          />
        </div>

        <button
          className="primary-btn"
          style={{ width: '100%' }}
          onClick={submit}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}