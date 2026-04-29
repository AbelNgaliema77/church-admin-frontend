import { request } from '../../lib/apiClient';
import { Team } from '../../types/domain';

export type Worker = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  teams: Team[];
};

export type CreateWorkerRequest = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  teamIds: string[];
};

export type UpdateWorkerRequest = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
};

export function getWorkers(token: string): Promise<Worker[]> {
  return request('/api/workers', token);
}

export function createWorker(token: string, data: CreateWorkerRequest) {
  return request('/api/workers', token, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateWorker(token: string, id: string, data: UpdateWorkerRequest) {
  return request(`/api/workers/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function deleteWorker(token: string, id: string) {
  return request(`/api/workers/${id}`, token, {
    method: 'DELETE'
  });
}