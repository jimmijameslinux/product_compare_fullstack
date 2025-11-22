// ✅ utils/filterUtils.js
import { PENALTY_WORDS } from "./constants.js";

export const isIrrelevantProduct = (title) => {
  const lower = title.toLowerCase();
  return PENALTY_WORDS.some((word) => lower.includes(word));
};