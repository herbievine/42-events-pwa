export function trim(text: string): string[] {
  return text.split("\n").map((line) => line.trim());
}

export function lineCount(text: string): number {
  return text.split("\n").length;
}
