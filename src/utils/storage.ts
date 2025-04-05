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
  title: string;
  task: string;
  answer: string;
  feedback: string | null;
  savedAt: string;
}

export function loadSavedTasks(): SavedTask[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("ielts_saved_tasks");
  return stored ? JSON.parse(stored) : [];
}

export function saveTask(task: SavedTask): SavedTask[] {
  const tasks = loadSavedTasks();
  const index = tasks.findIndex((t: SavedTask) => t.title === task.title);
  if (index >= 0) {
    if (!confirm("같은 제목이 있습니다. 덮어쓸까요?")) return tasks;
    tasks[index] = task;
  } else {
    tasks.push(task);
  }
  localStorage.setItem("ielts_saved_tasks", JSON.stringify(tasks));
  return tasks;
}

export function deleteTask(title: string): SavedTask[] {
  const tasks = loadSavedTasks().filter((t: SavedTask) => t.title !== title);
  localStorage.setItem("ielts_saved_tasks", JSON.stringify(tasks));
  return tasks;
}