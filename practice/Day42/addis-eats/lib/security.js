import crypto from "crypto";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(originalHash, "hex");

  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

export function createToken() {
  return crypto.randomBytes(32).toString("hex");
}
