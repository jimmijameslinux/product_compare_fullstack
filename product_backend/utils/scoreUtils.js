// ✅ utils/scoreUtils.js
import { normalize } from "./textUtils.js";
import { PENALTY_WORDS, VALID_PHONE_PATTERN } from "./constants.js";

const normalizeSpecs = (text) => {
  return text
    .replace(/(\d+)\s*(gb|tb|mb)/gi, (match, num, unit) => num + unit.toLowerCase())
    .replace(/(\d+)\s*(gb|tb|mb)\s*ram/gi, (match, num, unit) => num + unit.toLowerCase() + "ram");
};

/**
 * Extracts model numbers from text (handles brands + numbers)
 * Examples: "oneplus 15", "iphone 16 pro", "galaxy s24"
 */
const extractModelInfo = (text) => {
  const normalized = text.toLowerCase();
  const models = [];
  
  // Pattern: Brand followed by model number/name
  const modelPatterns = [
    /\b(oneplus|nothing|iqoo|realme|redmi|xiaomi|vivo|oppo|poco|tecno|infinix|honor|asus)\s+(\d+[a-z]*\+?)\b/gi,
    /\b(iphone)\s+(\d+)\s*(pro|max|plus|mini)?/gi,
    /\b(galaxy|note)\s+([a-z]\d+|note\s*\d+)/gi,
    /\b(pixel)\s+(\d+[a-z]*)/gi,
    /\b(motorola|nokia)\s+([a-z]?\d+[a-z]*)/gi,
  ];

  for (const pattern of modelPatterns) {
    let match;
    while ((match = pattern.exec(normalized)) !== null) {
      const brand = match[1];
      const model = match[2] + (match[3] ? match[3] : "");
      models.push({ brand, model: model.toLowerCase(), full: `${brand}${model}`.toLowerCase() });
    }
  }

  return models;
};

export const computeMatchScore = (itemTitle, query) => {
  const title = normalize(itemTitle);
  const queryNorm = normalize(query);
  
  // Normalize specs for both
  const titleSpecs = normalizeSpecs(title);
  const querySpecs = normalizeSpecs(queryNorm);
  
  const queryWords = querySpecs.split(" ").filter(Boolean);
  const titleWords = titleSpecs.split(" ").filter(Boolean);

  // Extract model info from both query and title
  const queryModels = extractModelInfo(query);
  const titleModels = extractModelInfo(itemTitle);

  let exactMatches = 0;
  let criticalMismatch = false;

  // Check if query has a specific model number
  if (queryModels.length > 0) {
    const queryModel = queryModels[0];
    
    // Check if title has the EXACT same brand + model
    const titleHasExactModel = titleModels.some(
      tm => tm.brand === queryModel.brand && tm.model === queryModel.model
    );

    if (!titleHasExactModel) {
      // Title has a different model number from the same brand - critical mismatch
      const titleHasSameBrandDifferentModel = titleModels.some(
        tm => tm.brand === queryModel.brand && tm.model !== queryModel.model
      );
      
      if (titleHasSameBrandDifferentModel) {
        criticalMismatch = true;
        console.log(`⚠️ Model mismatch: Query wants "${queryModel.brand} ${queryModel.model}" but title has different model`);
      }
    }
  }

  // If critical mismatch (wrong model number), return very low score
  if (criticalMismatch) {
    return 0.2; // Low score to deprioritize wrong models
  }

  // Word-by-word matching with spec normalization
  for (const qWord of queryWords) {
    const match = titleWords.some((tWord) => {
      // For numbers (storage, RAM, model numbers), require exact match
      if (/^\d+/.test(qWord)) {
        return tWord === qWord || tWord.startsWith(qWord);
      }
      // For text, allow partial match
      return tWord.includes(qWord) || qWord.includes(tWord);
    });
    if (match) exactMatches++;
  }

  let score = exactMatches / queryWords.length;

  // Bonus for full query substring match (with normalized specs)
  if (titleSpecs.includes(querySpecs)) {
    score += 0.15;
  }

  // Bonus for exact model match
  if (queryModels.length > 0 && titleModels.length > 0) {
    const exactModelMatch = queryModels.some(qm =>
      titleModels.some(tm => tm.full === qm.full)
    );
    if (exactModelMatch) {
      score += 0.2; // Significant bonus for exact model match
    }
  }

  // Penalty for irrelevant words
  for (const w of PENALTY_WORDS) {
    if (titleSpecs.includes(w)) {
      score -= 0.15;
    }
  }

  return Math.max(0, Math.min(1, score));
};

export const filterValidPhones = (items) => {
  return items.filter((item) => {
    const title = item.title.toLowerCase();
    return (
      (title.includes("phone") ||
        title.includes("mobile") ||
        title.includes("smartphone") ||
        VALID_PHONE_PATTERN.test(title)) &&
      !PENALTY_WORDS.some((w) => title.includes(w))
    );
  });
};