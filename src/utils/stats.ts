export function getNewStats(text: string) {
    return {
      words: text.trim().split(/\s+/).filter(Boolean).length,
      chars: text.length,
    };
  }