// ✅ utils/textUtils.js
export const normalize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();