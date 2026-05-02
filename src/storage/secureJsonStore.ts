import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";

type StoredRecord = {
  id: string;
};

function indexKey(namespace: string) {
  return `${namespace}.index`;
}

function itemKey(namespace: string, id: string) {
  return `${namespace}.item.${id}`;
}

async function readIndex(namespace: string) {
  const raw = await AsyncStorage.getItem(indexKey(namespace));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

async function writeIndex(namespace: string, ids: string[]) {
  const uniqueIds = Array.from(new Set(ids));
  await AsyncStorage.setItem(indexKey(namespace), JSON.stringify(uniqueIds));
}

export async function saveSecureRecord<T extends StoredRecord>(namespace: string, value: T) {
  await saveSecret(itemKey(namespace, value.id), JSON.stringify(value));

  const ids = await readIndex(namespace);
  if (!ids.includes(value.id)) {
    await writeIndex(namespace, [value.id, ...ids]);
  }
}

export async function listSecureRecords<T extends StoredRecord>(namespace: string): Promise<T[]> {
  const ids = await readIndex(namespace);
  const records: T[] = [];
  const validIds: string[] = [];

  for (const id of ids) {
    const raw = await readSecret(itemKey(namespace, id));
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as T;
      records.push(parsed);
      validIds.push(id);
    } catch {
      await deleteSecret(itemKey(namespace, id));
    }
  }

  if (validIds.length !== ids.length) {
    await writeIndex(namespace, validIds);
  }

  return records;
}

export async function deleteSecureRecord(namespace: string, id: string) {
  await deleteSecret(itemKey(namespace, id));
  const ids = await readIndex(namespace);
  await writeIndex(
    namespace,
    ids.filter((item) => item !== id)
  );
}
