import { cookies } from "next/headers";
import { hashPassword, verifyPassword, createToken } from "./security";

const SESSION_COOKIE = "addis_eats_session";

const SESSION_DURATION = 1000 * 60 * 60 * 24;

const users = [
  {
    id: "user-1",
    name: "Abebe",
    email: "abebe@example.com",
    role: "customer",
    passwordHash: hashPassword("Abebe123!"),
  },
  {
    id: "user-2",
    name: "Marta",
    email: "marta@example.com",
    role: "customer",
    passwordHash: hashPassword("Marta123!"),
  },
  {
    id: "staff-1",
    name: "Addis Eats Staff",
    email: "staff@addiseats.com",
    role: "staff",
    passwordHash: hashPassword("Staff123!"),
  },
];

const sessions = new Map();

export function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function authenticateUser(email, password) {
  const user = findUserByEmail(email);

  if (!user) {
    return null;
  }

  const valid = verifyPassword(password, user.passwordHash);

  if (!valid) {
    return null;
  }

  return user;
}

export function createSession(userId) {
  const token = createToken();

  sessions.set(token, {
    userId,
    expiresAt: Date.now() + SESSION_DURATION,
  });

  return token;
}

export function deleteSession(token) {
  sessions.delete(token);
}

function getSession(token) {
  if (!token) {
    return null;
  }

  const session = sessions.get(token);

  if (!session) {
    return null;
  }

  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  const session = getSession(token);

  if (!session) {
    return null;
  }

  return findUserById(session.userId) || null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireStaff() {
  const user = await requireUser();

  if (user.role !== "staff") {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export { SESSION_COOKIE, SESSION_DURATION };
