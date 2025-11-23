import { useState } from "react";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";

// Main App Component
function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [searchquery, setSearchquery] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Matrix-style background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#0a0e1a',
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 255, 157, 0.03) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 255, 157, 0.03) 3px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(0, 255, 157, 0.03) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 255, 157, 0.03) 3px
          )`,
          backgroundSize: '3px 3px'
        }}
      />
      
      {/* Animated glow effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 157, 0.1) 0%, transparent 50%)'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-bold mb-2"
            style={{
              color: '#00ffdd',
              textShadow: '0 0 20px rgba(0, 255, 221, 0.5), 0 0 40px rgba(0, 255, 221, 0.3)',
              fontFamily: 'monospace',
              letterSpacing: '0.1em'
            }}
          >
            Price Comparison
          </h1>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <SearchBar setProducts={setProducts} setQuery={setQuery} query={query} setSearchquery={setSearchquery} setLoading={setLoading} loading={loading} />
        </div>

        {/* Products Grid */}
        <ProductList products={products} query={query} searchquery={searchquery} loading={loading} />
      </div>
    </div>
  );
}

export default App;