export function stripBeforeTag(text: string, tag = "</think>"): string {
  if (!text) return text;
  const idx = text.indexOf(tag);
  if (idx === -1) return text;
  return text.slice(idx + tag.length);
}
