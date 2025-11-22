# 🛒 Price Comparison Finder - Frontend

A modern React application that helps users compare product prices across multiple e-commerce platforms including Amazon, Flipkart, and Reliance. Built with Vite and Tailwind CSS for fast performance and beautiful UI.

## 🌟 Features

- **Real-time Price Comparison**: Compare prices of products across Amazon, Flipkart, and Reliance Digital
- **Autocomplete Search**: Get intelligent search suggestions powered by 91mobiles API
- **Best Deal Highlighting**: Automatically identifies and highlights the lowest-priced product
- **Offer Tracking**: Display available offers and discounted prices side-by-side
- **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- **Loading States**: Skeleton loaders for smooth user experience while fetching data
- **Direct Links**: Quick access to product pages on respective platforms

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 📁 Project Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx               # React entry point
├── App.css                # Application styles
├── index.css              # Global styles
├── api/
│   └── api.js             # API client with axios
└── components/
    ├── SearchBar.jsx      # Search input with autocomplete
    └── ProductList.jsx    # Product cards and comparison display
```

## 🔧 Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.16 with Vite plugin
- **HTTP Client**: Axios 1.12.2
- **Linting**: ESLint 9.36.0
- **Testing**: Built with types for React (TypeScript support)

## 📦 Dependencies

### Core
- `react` - React library
- `react-dom` - React DOM rendering
- `axios` - HTTP client for API calls
- `tailwindcss` - Utility-first CSS framework

### Development
- `vite` - Next generation frontend tooling
- `@vitejs/plugin-react` - React support for Vite
- `eslint` - Code quality and consistency
- `eslint-plugin-react-hooks` - React hooks linting
- `eslint-plugin-react-refresh` - React refresh linting
- ESLint config and utilities

## 🎯 Key Components

### SearchBar Component
- Input field for product search
- Real-time autocomplete suggestions from 91mobiles API
- Compare button to trigger price comparison
- Loading state feedback
- Click-outside detection to close suggestions

### ProductList Component
- Displays products in a responsive grid layout
- Shows product image, title, site name, and prices
- Highlights the best deal with special styling and "💰 Best Deal" badge
- Displays available offers and discounts
- Direct links to product pages
- Skeleton loader animation during data fetch

### API Module
- `getSuggestions(query)` - Fetch autocomplete suggestions
- `getScrapedData(query)` - Fetch price comparison data from multiple sites
- Configured with 20-second timeout for reliability
- Error handling and fallback to empty arrays

## 🎨 UI Features

- Modern gradient background (blue to indigo)
- Smooth animations and transitions
- Responsive card layouts with hover effects
- Color-coded best deal cards (green highlight with ring effect)
- Toast-like notifications via browser console
- Accessible ARIA labels and semantic HTML
- Adaptive button states (disabled when loading)

## 🔌 API Integration

The frontend expects a backend API at `/api` with the following endpoints:

- `GET /api/scrape?query={query}` - Returns price comparison data
- `GET /api/autocomplete?query={query}` - Returns autocomplete suggestions

*Note: Vite proxy (configured in vite.config.js) forwards `/api` requests to the backend server*

## 🎯 How It Works

1. User enters a product name in the search bar
2. Autocomplete suggestions appear from 91mobiles API
3. User clicks "Compare" or selects a suggestion
4. Loading skeleton appears while fetching data
5. Backend scrapes prices from Amazon, Flipkart, and Reliance
6. Products are sorted by effective price (lowest first)
7. Best deal is highlighted with special styling
8. Available offers are displayed for each product

## 🚀 Performance

- Lazy loading with skeleton screens
- Debounced search input (250ms)
- Efficient price sorting algorithm
- Optimized Tailwind CSS with Vite
- Fast refresh during development

## 🛠️ Development

```bash
# Start dev server with HMR
npm run dev

# Build production bundle
npm run build

# Check for linting issues
npm run lint

# Preview production build locally
npm run preview
```

## 📝 Notes

- The app uses Vite's proxy configuration to forward API calls to the backend
- Tailwind CSS is configured as a Vite plugin for faster builds
- React Strict Mode is enabled for catching potential issues in development
- Product prices are normalized to handle different currency formats (₹ and commas)