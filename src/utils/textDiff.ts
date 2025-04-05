// src/utils/textDiff.ts
import { diffWords, Change } from "diff";

export function getDiffHtml(a: string, b: string): string {
  const changes: Change[] = diffWords(a, b);
  return changes
    .map((part) => {
      if (part.removed) return `<span class='line-through'>${part.value}</span>`;
      if (part.added) return `<span class='bg-yellow-300 px-1'>${part.value}</span>`;
      return part.value;
    })
    .join(" ");
}