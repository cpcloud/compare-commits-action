export function longestRepeatedCharLength(str: string, char: string): number {
  if (char.length !== 1) {
    throw RangeError(
      `expected \`char\` to be length 1, got: ${char} with length ${char.length}`
    );
  }

  let n = 0;
  for (let i = 0; i < str.length; ++i) {
    const start = i;
    while (str[i] === char) {
      ++i;
    }
    n = Math.max(n, i - start);
  }
  return n;
}
