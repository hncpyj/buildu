// src/utils/storage.ts

export function loadTempData<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : null;
}

export function saveTempData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export interface SavedTask {
  id: string; // unified with generic id
  task: string;
  answer: string;
  feedback: string | null;
  savedAt: string;
}

// Generic storage functions
export function loadStoredItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export function saveStoredItem<T extends { id: string }>(key: string, item: T): T[] {
  const items = loadStoredItems<T>(key);
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    if (!confirm("같은 제목이 있습니다. 덮어쓸까요?")) return items;
    items[index] = item;
  } else {
    items.push(item);
  }
  localStorage.setItem(key, JSON.stringify(items));
  return items;
}

export function deleteStoredItem<T extends { id: string }>(key: string, id: string): T[] {
  const items = loadStoredItems<T>(key).filter((i) => i.id !== id);
  localStorage.setItem(key, JSON.stringify(items));
  return items;
}