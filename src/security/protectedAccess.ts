import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { EmergencyPreferences } from "@/features/emergency/emergencyPreferences";

const SESSION_KEY = "sinalseguro.protected-access-session.v1";
const FAILED_ATTEMPTS_KEY = "sinalseguro.protected-access-failed-attempts.v1";
const HASH_VERSION = "v2";
const KDF_ROUNDS = 750;
const MAX_FAILED_ATTEMPTS = 5;
const UNLOCK_TTL_MS = 5 * 60 * 1000;
const LOCKOUT_MS = 2 * 60 * 1000;

type FailedAttemptState = {
  count: number;
  lockedUntil?: number;
};

export type SecurityCodeVerificationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
      reason: "incorrect" | "locked";
      lockedUntil?: number;
    };

type ValidationResult =
  | {
      ok: true;
      code: string;
    }
  | {
      ok: false;
      message: string;
    };

export function normalizeSecurityCode(code: string) {
  return code.replace(/\s+/g, "").slice(0, 16);
}

export function hasSecurityCode(preferences?: EmergencyPreferences | null) {
  return Boolean(preferences?.finishSafety.requireCode && preferences.finishSafety.codeHash);
}

export function validateSecurityCodePair(code: string, repeatedCode: string): ValidationResult {
  const normalizedCode = normalizeSecurityCode(code);
  const normalizedRepeatedCode = normalizeSecurityCode(repeatedCode);

  if (normalizedCode.length < 4) {
    return {
      ok: false,
      message: "Use pelo menos 4 digitos."
    };
  }

  if (normalizedCode !== normalizedRepeatedCode) {
    return {
      ok: false,
      message: "Os codigos nao conferem."
    };
  }

  return {
    ok: true,
    code: normalizedCode
  };
}

export async function hashSecurityCode(code: string) {
  const salt = Crypto.randomUUID().replace(/-/g, "");
  const hash = await deriveSecurityCodeHash(normalizeSecurityCode(code), salt);
  return `${HASH_VERSION}:${salt}:${hash}`;
}

export async function verifySecurityCode(preferences: EmergencyPreferences, code: string) {
  const result = await verifySecurityCodeStatus(preferences, code);
  return result.ok;
}

export async function verifySecurityCodeStatus(
  preferences: EmergencyPreferences,
  code: string
): Promise<SecurityCodeVerificationResult> {
  if (!hasSecurityCode(preferences)) return { ok: true };

  const lockout = await getActiveLockout();
  if (lockout.locked) {
    return {
      ok: false,
      message: formatLockoutMessage(lockout.lockedUntil),
      reason: "locked",
      lockedUntil: lockout.lockedUntil
    };
  }

  const expectedHash = preferences.finishSafety.codeHash;
  const normalizedCode = normalizeSecurityCode(code);
  const verified = await verifyHash(normalizedCode, expectedHash);

  if (verified) {
    await clearFailedAttempts();
    return { ok: true };
  }

  const attempts = await registerFailedAttempt();
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    return {
      ok: false,
      message: formatLockoutMessage(attempts.lockedUntil),
      reason: "locked",
      lockedUntil: attempts.lockedUntil
    };
  }

  return {
    ok: false,
    message: "Codigo incorreto.",
    reason: "incorrect"
  };
}

export async function unlockProtectedAccess() {
  const unlockedAt = Date.now();
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ expiresAt: unlockedAt + UNLOCK_TTL_MS, unlockedAt }));
}

export async function isProtectedAccessUnlocked() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as { expiresAt?: number; unlockedAt?: number };
    const validUntil =
      typeof parsed.expiresAt === "number"
        ? parsed.expiresAt
        : typeof parsed.unlockedAt === "number"
          ? parsed.unlockedAt + UNLOCK_TTL_MS
          : 0;

    const valid = Date.now() < validUntil;
    if (!valid) await clearProtectedAccess();
    return valid;
  } catch {
    await clearProtectedAccess();
    return false;
  }
}

export async function clearProtectedAccess() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

async function deriveSecurityCodeHash(normalizedCode: string, salt: string) {
  let value = `${salt}:${normalizedCode}`;

  for (let index = 0; index < KDF_ROUNDS; index += 1) {
    value = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${index}:${value}`);
  }

  return value;
}

async function verifyHash(normalizedCode: string, storedHash: string) {
  const parsedHash = parseVersionedHash(storedHash);

  if (parsedHash) {
    const nextHash = await deriveSecurityCodeHash(normalizedCode, parsedHash.salt);
    return nextHash === parsedHash.hash;
  }

  const legacyHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, normalizedCode);
  return legacyHash === storedHash;
}

function parseVersionedHash(storedHash: string) {
  const [version, salt, hash] = storedHash.split(":");

  if (version !== HASH_VERSION || !salt || !hash) return null;
  if (!/^[a-f0-9]{16,}$/i.test(salt) || !/^[a-f0-9]{64}$/i.test(hash)) return null;

  return { hash: hash.toLowerCase(), salt };
}

async function getFailedAttempts(): Promise<FailedAttemptState> {
  const raw = await AsyncStorage.getItem(FAILED_ATTEMPTS_KEY);
  if (!raw) return { count: 0 };

  try {
    const parsed = JSON.parse(raw) as FailedAttemptState;
    return {
      count: typeof parsed.count === "number" ? parsed.count : 0,
      lockedUntil: typeof parsed.lockedUntil === "number" ? parsed.lockedUntil : undefined
    };
  } catch {
    return { count: 0 };
  }
}

async function getActiveLockout() {
  const attempts = await getFailedAttempts();
  if (!attempts.lockedUntil) return { locked: false as const };

  const locked = Date.now() < attempts.lockedUntil;
  if (!locked) await clearFailedAttempts();
  return locked
    ? { locked: true as const, lockedUntil: attempts.lockedUntil }
    : { locked: false as const };
}

async function registerFailedAttempt() {
  const attempts = await getFailedAttempts();
  const nextCount = attempts.count + 1;
  const nextState: FailedAttemptState = {
    count: nextCount,
    lockedUntil: nextCount >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCKOUT_MS : attempts.lockedUntil
  };

  await AsyncStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(nextState));
  return nextState;
}

async function clearFailedAttempts() {
  await AsyncStorage.removeItem(FAILED_ATTEMPTS_KEY);
}

function formatLockoutMessage(lockedUntil: number) {
  const remainingSeconds = Math.max(1, Math.ceil((lockedUntil - Date.now()) / 1000));
  const remainingMinutes = Math.max(1, Math.ceil(remainingSeconds / 60));
  return `Muitas tentativas. Aguarde cerca de ${remainingMinutes} min antes de tentar novamente.`;
}
