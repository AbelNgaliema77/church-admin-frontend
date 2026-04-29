import { request } from '../../lib/apiClient';
import { LoginState } from '../../types/api';

export type LoginRequest = {
  email: string;
  password: string;
};

export type SetPasswordRequest = {
  token: string;
  password: string;
  confirmPassword: string;
};

type FlatBackendAuthResponse = {
  token: string;
  id: string;
  email: string;
  displayName: string;
  role: LoginState['user']['role'];
  isActive: boolean;
};

type BackendAuthResponse = LoginState | FlatBackendAuthResponse;

function isLoginState(response: BackendAuthResponse): response is LoginState {
  return 'user' in response && response.user !== undefined;
}

function normalizeAuthResponse(response: BackendAuthResponse): LoginState {
  if (isLoginState(response)) {
    return response;
  }

  return {
    token: response.token,
    user: {
      id: response.id,
      email: response.email,
      displayName: response.displayName,
      role: response.role,
      isActive: response.isActive
    }
  };
}

export async function login(data: LoginRequest): Promise<LoginState> {
  const response = await request<BackendAuthResponse>('/api/auth/login', undefined, {
    method: 'POST',
    body: JSON.stringify(data)
  });

  return normalizeAuthResponse(response);
}

export async function setPassword(data: SetPasswordRequest): Promise<LoginState> {
  const response = await request<BackendAuthResponse>(
    '/api/auth/set-password',
    undefined,
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  );

  return normalizeAuthResponse(response);
}