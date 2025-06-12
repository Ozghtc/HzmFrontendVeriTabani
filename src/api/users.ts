import { API_BASE_URL } from './config';

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error('Kullanıcılar alınamadı');
  return response.json();
}

export async function addUser(user: any) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Kullanıcı eklenemedi');
  return response.json();
}

export async function deleteUser(userId: string) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Kullanıcı silinemedi');
  return response.json();
}

export async function updateUser(userId: string, user: any) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Kullanıcı güncellenemedi');
  return response.json();
} 