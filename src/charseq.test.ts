import { longestRepeatedCharLength } from "./charseq";

const TICK = "`";

test("empty", () => {
  const input = "";
  expect(longestRepeatedCharLength(input, TICK)).toBe(0);
});

test("zero", () => {
  const input = "abcdef";
  expect(longestRepeatedCharLength(input, TICK)).toBe(0);
});

test("one|left", () => {
  const input = "`a";
  expect(longestRepeatedCharLength(input, TICK)).toBe(1);
});

test("one|right", () => {
  const input = "a`";
  expect(longestRepeatedCharLength(input, TICK)).toBe(1);
});

test("two", () => {
  const input = "`a``";
  expect(longestRepeatedCharLength(input, TICK)).toBe(2);
});

test("three", () => {
  const input = "a``aaaaa```a`a`a";
  expect(longestRepeatedCharLength(input, TICK)).toBe(3);
  expect(longestRepeatedCharLength(input, "a")).toBe(5);
});

test("invalid length char", () => {
  const input = "";
  expect(() => longestRepeatedCharLength(input, "")).toThrow(RangeError);
  expect(() => longestRepeatedCharLength(input, "ab")).toThrow(RangeError);
});
