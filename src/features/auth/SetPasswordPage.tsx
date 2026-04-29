import { useMemo, useState } from 'react';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { SuccessBanner } from '../../components/ui/SuccessBanner';
import { LoginState } from '../../types/api';
import { storeAuth } from './authStorage';
import { setPassword } from './authApi';

type SetPasswordPageProps = {
  onLogin: (auth: LoginState) => void;
};

export function SetPasswordPage({ onLogin }: SetPasswordPageProps) {
  const inviteToken = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') ?? '';
  }, []);

  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit() {
    if (!inviteToken) {
      setPageError('Invite token is missing.');
      return;
    }

    if (password.length < 8) {
      setPageError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setPageError('Passwords do not match.');
      return;
    }

    try {
      setIsSaving(true);
      setPageError(null);
      setSuccessMessage(null);

      const result = await setPassword({
        token: inviteToken,
        password,
        confirmPassword
      });

      storeAuth(result);
      setSuccessMessage('Password set successfully. Redirecting...');
      window.history.replaceState({}, '', '/');

      onLogin(result);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Failed to set password.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-mark">LB</div>

        <h1>Set Password</h1>
        <p>Create your password for La Borne Church Cape Durbanville.</p>

        <ErrorBanner message={pageError} />
        <SuccessBanner message={successMessage} />

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            disabled={isSaving}
            onChange={(event) => setPasswordValue(event.target.value)}
            placeholder="Minimum 8 characters"
          />
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            disabled={isSaving}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
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
          disabled={isSaving}
        >
          {isSaving ? 'Saving password...' : 'Set Password'}
        </button>
      </div>
    </div>
  );
}