export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "STUDENT";
  isActive: boolean;
  createdAt: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

interface RegisterResponse {
  message: string;
  user: AuthUser;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
).replace(/\/$/, "");

const TOKEN_KEY = "campus_events_access_token";
const USER_KEY = "campus_events_user";

async function authRequest<T>(
  endpoint: string,
  body: Record<string, string>,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Cannot connect to the Campus Events API. Check that the backend is running.",
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message;

    throw new Error(
      Array.isArray(message)
        ? message.join(", ")
        : message || "Authentication request failed.",
    );
  }

  return data as T;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  return authRequest<RegisterResponse>("register", data);
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const result = await authRequest<LoginResponse>("login", data);

  if (!result.accessToken || !result.user) {
    throw new Error("The server returned an invalid login response.");
  }

  localStorage.setItem(TOKEN_KEY, result.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(result.user));

  return result;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const value = localStorage.getItem(USER_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    logoutUser();
    throw new Error("Your session has expired. Please log in again.");
  }

  const data = await response.json();
  const user = data.user as AuthUser;

  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
}
