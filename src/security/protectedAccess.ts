import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { EmergencyPreferences } from "@/features/emergency/emergencyPreferences";

const SESSION_KEY = "sinalseguro.protected-access-session.v1";
const UNLOCK_TTL_MS = 5 * 60 * 1000;

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
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, normalizeSecurityCode(code));
}

export async function verifySecurityCode(preferences: EmergencyPreferences, code: string) {
  if (!hasSecurityCode(preferences)) return true;

  const codeHash = await hashSecurityCode(code);
  return codeHash === preferences.finishSafety.codeHash;
}

export async function unlockProtectedAccess() {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ unlockedAt: Date.now() }));
}

export async function isProtectedAccessUnlocked() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as { unlockedAt?: number };
    return typeof parsed.unlockedAt === "number" && Date.now() - parsed.unlockedAt < UNLOCK_TTL_MS;
  } catch {
    return false;
  }
}

export async function clearProtectedAccess() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
