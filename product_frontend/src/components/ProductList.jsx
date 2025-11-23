import { TrendingDown } from 'lucide-react';

function ProductList({ products, query, searchquery, loading }) {
  if (loading) {
    return (
      <div className="mt-1 w-full flex items-center">
        <div className="mt-10 w-full flex flex-wrap justify-center gap-6">
          <div role="status" className="max-w-sm p-4 rounded-sm shadow-sm animate-pulse md:p-6">
            <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded-sm dark:bg-gray-700"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  // ✅ Compute effective price for each product before sorting
  const productsWithEffectivePrice = products.map((p) => {
    let basePrice = parseFloat(p.discountAmount?.toString().replace(/[₹,]/g, "")) || p.price || Infinity;
    let effectivePrice = basePrice;

    // If it's a Flipkart and Amazon product and has offers → pick the *lowest* FinalPrice
    if ((p.site?.toLowerCase().includes("flipkart") || p.site?.toLowerCase().includes("amazon")) && Array.isArray(p.offers) && p.offers.length > 0) {
      const offerPrices = p.offers
        .map((o) => parseFloat(o.discountAmount?.toString().replace(/[₹,]/g, "")))
        .filter((v) => !isNaN(v));
      if (offerPrices.length > 0) {
        const lowestOfferPrice = Math.min(...offerPrices);
        effectivePrice = Math.min(basePrice, lowestOfferPrice);
      }
    }

    // 

    // if for amazon just use the base newPrice from p itself
    // if (p.site?.toLowerCase().includes("amazon")) {
    //   effectivePrice = parseFloat(p.newPrice?.replace(/[₹,]/g, "")) || effectivePrice;
    // }


    return { ...p, effectivePrice };
  });

  // ✅ Sort all products by effectivePrice ascending
  const sortedProducts = [...productsWithEffectivePrice].sort(
    (a, b) => a.effectivePrice - b.effectivePrice
  );

  const lowestPrice = sortedProducts[0]?.effectivePrice || Infinity;

  return (
    <div className="mt-1 w-full flex flex-col items-center">
      {!loading && (
        <h2 className="text-lg font-semibold text-gray-800 mt-4" style={{ color: '#00ffdd', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          {`Results for: "${searchquery}"`}
        </h2>
      )}
      {/* No changes needed here */}
      <div className="mt-10 w-full flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        {sortedProducts.map((p, i) => {
          const isLowest = p.effectivePrice === lowestPrice;

          let offers = p.offers || [];

          

          return (
            <div
              key={i}
              className="p-6 rounded-3xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'rgba(0, 50, 30, 0.4)',
                border: '3px solid rgb(0, 255, 221)',
                borderRadius: '30px',
                boxShadow: isLowest ? '0 0 30px rgba(255, 150, 0, 0.6), inset 0 0 30px rgba(0, 255, 157, 0.1)' : '0 0 30px rgba(0, 255, 157, 0.4), inset 0 0 30px rgba(0, 255, 157, 0.1)',
                backdropFilter: 'blur(10px)',
                width: '320px'
              }}
            >
              {/* Product Image */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-40 h-40 rounded-xl overflow-hidden"
                  style={{
                    border: '2px solid #00ff9d',
                    boxShadow: '0 0 15px rgba(0, 255, 157, 0.3)'
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Name */}
              <h3
                className="text-lg font-bold text-center mb-2 line-clamp-2"
                style={{
                  color: '#00ffdd',
                  fontFamily: 'monospace',
                  textShadow: '0 0 10px rgba(0, 255, 221, 0.5)'
                }}
              >
                {p.title}
              </h3>

              {/* Store Name */}
              <p
                className="text-center text-sm mb-4"
                style={{
                  color: '#00ff9d',
                  fontFamily: 'monospace'
                }}
              >
                {p.site}
              </p>

              {
                p.Unavailable && (
                  <p className="text-center text-sm mb-4" style={{ color: 'red', fontFamily: 'monospace' }}>
                    Unavailable
                  </p>
                )
              }

              <div className="mb-4 text-center">
                {offers.length > 0 && (
                  <p className="text-sm line-through mb-1" title={p.oldPrice}
                    style={{ color: '#666' }}
                  >
                    {p.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </p>
                )}

                {/* Amazon old price */}
                {/* {p.site?.toLowerCase().includes("amazon") && p.newPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    {p.price}
                  </p>
                )} */}

                {/* ✅ Display Effective Price */}
                <p
                  className={`text-xl font-bold ${isLowest ? "text-green-700" : "text-green-600"}`}
                  title={`Effective Price: ₹${p.effectivePrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}`}
                  style={{
                    color: '#00ffdd',
                    textShadow: '0 0 15px rgba(0, 255, 221, 0.5)'
                  }}
                >
                  {p.effectivePrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </p>

                {isLowest && (
                  <div
                    className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: 'rgba(255, 150, 0, 0.2)',
                      border: '1px solid #ff9600',
                      color: '#ff9600'
                    }}
                  >
                    <TrendingDown size={14} />
                    Best Deal
                  </div>
                )}

                {/* ✅ Show offers if available */}
                {Array.isArray(p.offers) && p.offers.length > 0 && (
                  <div className="mb-4">
                    <p
                      className="text-sm font-bold mb-2"
                      style={{
                        color: '#00ffdd',
                        fontFamily: 'monospace'
                      }}
                    >
                      Available Offers:
                    </p>
                    <div className="space-y-1 overflow-y-auto">
                    {p.offers.map((offer, idx) => {
                      const finalPrice = offer.discountAmount || 0;
                      return (
                        <div 
                          key={idx}
                          className="flex justify-between text-xs"
                          style={{
                            color: '#00ff9d',
                            fontFamily: 'monospace'
                          }}
                        >
                          <span>{offer.offerTitle}</span>
                          <span>₹{finalPrice.toLocaleString("en-IN")}</span>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                )}

                {/* ✅ Show Cashbacks if available*/}
                {Array.isArray(p.cashback) && p.cashback.length > 0 && (
                  <div className="mb-4">
                    <p
                      className="text-sm font-bold mb-2"
                      style={{
                        color: '#00ffdd',
                        fontFamily: 'monospace'
                      }}
                    >
                      Available Cashbacks:
                    </p>
                    <div className="space-y-1 overflow-y-auto">
                    {p.cashback.map((cb, idx) => {
                      return (
                        <div
                          key={idx}
                          className="flex justify-between text-xs"
                          style={{
                            color: '#00ff9d',
                            fontFamily: 'monospace'
                          }}
                        >
                          <span>{cb.provider}</span>
                          <span>₹{cb.amount.toLocaleString("en-IN")}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-block mt-3 text-sm px-4 py-2 rounded-lg transition ${isLowest
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  title="View Deal"
                  aria-label={`View deal for ${p.title}`}
                >
                  View Deal
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductList;