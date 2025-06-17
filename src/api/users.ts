import { API_BASE_URL } from './config';
import { paketler } from '../pages/AdminUsersFiyatlandirma';

const API_KEY = import.meta.env.VITE_API_KEY;

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };
}

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Kullanıcılar alınamadı');
  const users = await response.json();
  return users.map((u: any) => {
    const selectedPackage = u.selected_package;
    const selectedPackageInfo = paketler.find(p => p.ad === selectedPackage) || null;
    return {
      ...u,
      selectedPackage,
      selectedPackageInfo,
    };
  });
}

export async function createUser(user: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Kullanıcı eklenemedi');
    }
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Kullanıcı eklenemedi');
  }
}

export async function deleteUser(userId: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Kullanıcı silinemedi');
  return response.json();
}

export async function updateUser(userId: string, user: any) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Kullanıcı güncellenemedi');
  return response.json();
} 