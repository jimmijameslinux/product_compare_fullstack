# 📦 Product Price & Offer Scraper  
### (Amazon • Flipkart • Reliance Digital)

A powerful Node.js-based scraping engine that extracts **real-time product data**, including prices, offers, and product details from:

- 🛒 **Amazon**
- 🟦 **Flipkart**
- 🔴 **Reliance Digital**

The scraper is optimized for **accuracy**, **irrelevant product filtering**, and **consistent output format** across all platforms.

---

## 🚀 Features

### 🔍 Smart Product Detection
- Removes irrelevant items (cases, covers, chargers, cables, etc.)
- Cleans titles and normalizes product names
- Uses custom rules to identify real phone models

### 💰 Price Extraction
- Pulls current selling price
- Extracts MRP (old price)
- Converts price into **₹ Indian format**

### 🎁 Offer Extraction
- Bank offers
- Card offers
- Cashback offers
- Final price after discount

### 📦 Unified Output Format
Every website returns:

```json
{
  "title": "",
  "price": "",
  "mprice": "",
  "image": "",
  "link": "",
  "offers": []
}
```

---

## 📂 Project Structure

```
/project-root
│
├── amazon/
│   └── scrapeAmazon.js
│
├── flipkart/
│   └── scrapeFlipkart.js
│
├── reliance/
│   └── extractRelianceInitialState.js
│
├── utils/
│   ├── filterUtils.js
│   └── scoreUtils.js
│
└── index.js
```

---

## 🔧 Installation

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo

npm install
```

---

## ▶️ Usage Example

```js
import { scrapeAmazonRequest } from "./amazon/scrapeAmazon.js";
import { scrapeFlipkartFull } from "./flipkart/scrapeFlipkart.js";
import { extractRelianceInitialState } from "./reliance/extractRelianceInitialState.js";

const query = "Samsung Galaxy S24";

const amazon = await scrapeAmazonRequest(query);
const flipkart = await scrapeFlipkartFull(query);
const reliance = await extractRelianceInitialState(query);

console.log({ amazon, flipkart, reliance });
```

---

## 🧠 Utils

### 🔹 Irrelevant Product Filter
Located in `/utils/filterUtils.js`, used to eliminate items like:

- Back covers  
- Screen protectors  
- Chargers & adapters  
- SIM cards  
- USB cables  

### 🔹 Score Utils *(optional)*  
Helps choose best matching product using fuzzy matching.

---

## ⚠️ Disclaimer

This project is intended **only for educational and research purposes**.  
Scraping websites may violate their terms of service — use responsibly.

---

## ⭐ Support the Project

If you find this useful, please consider giving a **⭐ star on GitHub**!
