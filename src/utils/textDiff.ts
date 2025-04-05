import { diffWords, Change } from "diff";

export function getDiffHtml(a: string, b: string): string {
  const changes: Change[] = diffWords(a, b);
  return changes
    .map((part) => {
      if (part.added) return `<span class="bg-green-300 px-1">${part.value}</span>`;
      if (part.removed) return `<span class="bg-red-300 px-1 line-through">${part.value}</span>`;
      return part.value;
    })
    .join(" ");
}