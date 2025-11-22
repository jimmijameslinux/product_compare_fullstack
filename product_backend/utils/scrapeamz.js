import axios from "axios";
import { parse } from "node-html-parser";
import { computeMatchScore, filterValidPhones } from "../utils/scoreUtils.js";
import { isIrrelevantProduct } from "../utils/filterUtils.js";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-IN,en;q=0.9",
};

export const scrapeAmazonRequest = async (query) => {
  try {
    let scrapedData = [];

    // --------------------------------------------------------
    // SEARCH PAGE SCRAPING
    // --------------------------------------------------------
    const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    console.log("🔍 Requesting:", url);

    const response = await axios.get(url, { headers });
    const root = parse(response.data);

    const items = root.querySelectorAll(".s-main-slot > div[data-asin]");

    for (const el of items) {
      const isSponsored = el.querySelector("span.s-sponsored-label-text")?.innerText.trim();
      if (isSponsored) continue;

      const title = el.querySelector("h2 span")?.innerText.trim();
      let price = el.querySelector(".a-price .a-offscreen")?.innerText.trim();
      const linkSuffix = el.querySelector("a.a-link-normal")?.getAttribute("href");
      const image = el.querySelector("img")?.getAttribute("src");

      if (!linkSuffix) continue;

      const link = "https://www.amazon.in" + linkSuffix;

      if (title && !isIrrelevantProduct(title)) {
        scrapedData.push({ title, price, link, image });
      }
    }

    if (!scrapedData.length) return null;

    // BEST MATCH FINDING
    const ranked = scrapedData.map((item) => ({
      ...item,
      matchScore: computeMatchScore(item.title, query),
    }));

    const valid = filterValidPhones(ranked).sort((a, b) => b.matchScore - a.matchScore);
    const bestMatch = valid[0];

    if (!bestMatch) return null;

    console.log("✅ Best Amazon Match:", bestMatch.title);


    // --------------------------------------------------------
    // PRODUCT PAGE SCRAPING
    // --------------------------------------------------------
    const mobileHeaders = {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.110 Mobile Safari/537.36",
      "Accept-Language": "en-IN,en;q=0.9",
    };

    console.log("🔁 Fetching product page:", bestMatch.link);

    const productRes = await axios.get(bestMatch.link, { headers: mobileHeaders });
    const parsedPage = parse(productRes.data);

    const offers = [];
    const cashback = [];

    const cards = parsedPage.querySelectorAll("li.a-carousel-card");

    for (const card of cards) {
      const headerText =
        card.querySelector(".cardification-combo-card-header span")?.innerText?.trim().toLowerCase() || "";

      const priceText = card.querySelector(".smx-saving-amount")?.innerText?.trim();
      if (!headerText || !priceText) continue;

      // ❌ Skip coupon / emi / with
      if (/coupon|emi|with/.test(headerText)) continue;

      const rows = card.querySelectorAll(".cardification-combo-header");

      for (const row of rows) {
        const provider = row.querySelector("span.a-truncate-full")?.innerText?.trim();
        const money = row.querySelector(".cardification-combo-header-money")?.innerText?.trim();

        if (!provider || !money) continue;

        const amountMatch = money.match(/₹[\d,]+/);
        if (!amountMatch) continue;

        const amount = amountMatch[0];
        const className = row.getAttribute("class") || "";

        // -----------------------------------------------------
        // ✔️ CASHBACK (only via CLASS)
        // -----------------------------------------------------
        if (className.includes("CASHBACK")) {
          cashback.push({
            provider,
            amount:parseInt(amount.replace(/[₹,]/g, ""), 10),
          });
          continue; // ⛔ ensure it does NOT go to offers[]
        }

        // -----------------------------------------------------
        // ✔️ NORMAL OFFER (all others)
        // -----------------------------------------------------
        offers.push({
          offerTitle: provider,
          discountAmount: parseInt(priceText.replace(/[₹,]/g, ""), 10),
        });
      }
    }


    bestMatch.offers = offers;
    bestMatch.cashback = cashback;
    bestMatch.price = parseInt(bestMatch.price.replace(/[₹,]/g, ""), 10);

    console.log("Provider Offers Found:", offers);
    console.log("Cashback Offers Found:", cashback);

    return bestMatch;
  } catch (err) {
    console.error("💥 Amazon scraping failed:", err);
    return null;
  }
};


