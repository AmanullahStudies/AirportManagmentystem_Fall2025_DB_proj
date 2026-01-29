export function isUrduText(text) {
  const urduRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFCFF]/
  return urduRegex.test(text)
}
