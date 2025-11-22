
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Search } from 'lucide-react';


// function SearchBar({ setProducts, setQuery, query, loading, setLoading }) {
//   const [suggestions, setSuggestions] = useState([]);
//   const [blockSuggest, setBlockSuggest] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(-1); // 🔵 keyboard navigation
//   const [suggestLoading, setSuggestLoading] = useState(false); // 🔵 autosuggest loading

//   const wrapperRef = useRef(null);

//   // --------------------------------------------------------
//   // Close suggestion box on outside click
//   // --------------------------------------------------------
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setSuggestions([]);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // --------------------------------------------------------
//   // 🔵 Debounced Autosuggest (with loading)
//   // --------------------------------------------------------
//   useEffect(() => {
//     if (blockSuggest) return;
//     if (!query || query.trim().length < 1) {
//       setSuggestions([]);
//       return;
//     }

//     const timeout = setTimeout(async () => {
//       try {
//         setSuggestLoading(true);

//         const res = await fetch(
//           `https://www.91mobiles.com/autosuggest/search_as_index4.php?back_fill=1&c=all&country=&q=${encodeURIComponent(
//             query.trim()
//           )}&source=web`
//         );
//         const data = await res.json();

//         if (!data?.suggestions) {
//           setSuggestions([]);
//           setSuggestLoading(false);
//           return;
//         }

//         const names = data.suggestions
//           .filter((item) => item?.pro_id && item?.cat_id === 553)
//           .map((item) => ({
//             name: item.name,
//             img: item.img || item.image || item.thumbnail || null,
//           }))
//           .slice(0, 12);

//         setSuggestions(names);
//         setActiveIndex(-1); // reset keyboard highlight
//       } catch (err) {
//         console.error("Autosuggest error:", err);
//       } finally {
//         setSuggestLoading(false);
//       }
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [query, blockSuggest]);

//   // --------------------------------------------------------
//   // 🔵 Keyboard Navigation
//   // --------------------------------------------------------
//   const handleKeyDown = (e) => {
//     if (suggestions.length === 0) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setActiveIndex((i) => (i + 1) % suggestions.length);
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
//     }

//     if (e.key === "Enter") {
//       if (activeIndex >= 0 && activeIndex < suggestions.length) {
//         const selected = suggestions[activeIndex];
//         setBlockSuggest(true);
//         setQuery(selected.name);
//         setSuggestions([]);
//         handleSearch(selected.name);
//       }
//       handleSearch(query);
//     }
//   };

//   // --------------------------------------------------------
//   // Search Button Handler
//   // --------------------------------------------------------
//   const handleSearch = async (value) => {
//     setQuery(value);
//     setSuggestions([]);
//     setLoading(true);

//     try {
//       const res = await axios.get(`/api/scrape?query=${encodeURIComponent(value)}`);
//       const sites = ["amazon", "flipkart", "reliance"];

//       console.log("Scrape response:", res.data); // 🔵 Debug log

//       const formatted = sites
//         .map((site) => {
//           const data = res.data[site];
//           if (!data) return null;

//           return {
//             site: site.charAt(0).toUpperCase() + site.slice(1),
//             title: data.title,
//             price: data.price,
//             offers: data.offers,
//             cashback: data.cashback,
//             url: data.link,
//             image: data.image,
//             Unavailable: data.Unavailable || false,
//           };
//         })
//         .filter(Boolean);

//       setProducts(formatted);
//     } catch (err) {
//       console.error("Scrape error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------------
//   // Highlight matched text inside suggestions
//   // --------------------------------------------------------
//   const highlightText = (text, query) => {
//     const regex = new RegExp(`(${query})`, "i");
//     const parts = text.split(regex);

//     return parts.map((p, idx) =>
//       regex.test(p) ? (
//         <span key={idx} className="font-semibold text-blue-600">
//           {p}
//         </span>
//       ) : (
//         <span key={idx}>{p}</span>
//       )
//     );
//   };

//   // --------------------------------------------------------
//   // UI
//   // --------------------------------------------------------
//   return (
//     <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
//       <label
//         className="block text-lg mb-3"
//         style={{
//           color: '#00ffdd',
//           fontFamily: 'monospace',
//           letterSpacing: '0.05em'
//         }}
//       >
//         Search Product
//       </label>
//       <div className="relative">
//         {/* INPUT */}
//         <input
//           type="text"
//           className="w-full px-6 py-4 text-white text-lg outline-none bg-transparent"
//           placeholder="Search for a mobile"
//           value={query}
//           onChange={(e) => {
//             setBlockSuggest(false);
//             setQuery(e.target.value);
//           }}
//           onKeyDown={handleKeyDown}
//            style={{
//             backgroundColor: 'rgba(0, 100, 100, 0.3)',
//             border: '2px solid #00ffdd',
//             borderRadius: '8px',
//             boxShadow: '0 0 20px rgba(0, 255, 221, 0.3), inset 0 0 20px rgba(0, 255, 221, 0.1)',
//             fontFamily: 'monospace'
//           }}
//         />

//         {/* Compare Button */}
//         <button
//           onClick={() => handleSearch(query)}
//          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
//           style={{ color: '#00ffdd' }}
//           disabled={!query || loading}
//         >
//           {/* {loading ? "Fetching..." : "Compare"} */}
//           <Search size={24} />
//         </button>
//       </div>

//       {/* SUGGESTIONS BOX */}
//       {(suggestions.length > 0 || suggestLoading) && (
//         <ul className="absolute bg-slate-800 border w-full mt-2 rounded-lg shadow-xl max-h-60 overflow-y-auto z-10" style={{ borderColor: '#00ff9d' }}>

//           {/* Loading spinner */}
//           {suggestLoading && (
//             <li className="px-4 py-3 text-gray-500 flex gap-3 items-center">
//               <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
//               Searching…
//             </li>
//           )}

//           {!suggestLoading &&
//             suggestions.map((s, i) => (
//               <li
//                 key={i}
//                 className={`px-4 py-2 cursor-pointer flex items-center gap-3 ${i === activeIndex ? "bg-blue-100" : "hover:bg-blue-50"
//                   }`}
//                 onMouseDown={() => {
//                   setBlockSuggest(true);
//                   setQuery(s.name);
//                   setSuggestions([]);
//                 }}
//               >
//                 {s.img && <img src={s.img} alt={s.name} className="w-10 h-10 rounded" />}

//                 <span className={`${i === activeIndex ? "text-blue-600 font-semibold" : "text-gray-300"}`}>
//                   {highlightText(s.name, query)}
//                 </span>
//               </li>
//             ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default SearchBar;

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search } from "lucide-react";

function SearchBar({ setProducts, setQuery, query, loading, setLoading }) {
  const [suggestions, setSuggestions] = useState([]);
  const [blockSuggest, setBlockSuggest] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const wrapperRef = useRef(null);

  // --------------------------------------------------------
  // 🔵 Debounced Autosuggest
  // --------------------------------------------------------
  useEffect(() => {
    if (blockSuggest) return;
    if (!query || query.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSuggestLoading(true);

        const res = await fetch(
          `https://www.91mobiles.com/autosuggest/search_as_index4.php?back_fill=1&c=all&country=&q=${encodeURIComponent(
            query.trim()
          )}&source=web`
        );
        const data = await res.json();

        if (!data?.suggestions) {
          setSuggestions([]);
          setSuggestLoading(false);
          return;
        }

        const names = data.suggestions
          .filter((item) => item?.pro_id && item?.cat_id === 553)
          .map((item) => ({
            name: item.name,
            img: item.img || item.image || item.thumbnail || null,
          }))
          .slice(0, 12);

        setSuggestions(names);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Autosuggest error:", err);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, blockSuggest]);

  // --------------------------------------------------------
  // 🔵 Keyboard Navigation
  // --------------------------------------------------------
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const selected = suggestions[activeIndex];
        setBlockSuggest(true);
        setQuery(selected.name);
        setSuggestions([]);
        handleSearch(selected.name);
        return;
      }
      handleSearch(query);
    }
  };

  // --------------------------------------------------------
  // 🔵 Search Handler
  // --------------------------------------------------------
  const handleSearch = async (value) => {
    setQuery(value);
    setSuggestions([]);
    setLoading(true);

    try {
      const res = await axios.get(`/api/scrape?query=${encodeURIComponent(value)}`);
      const sites = ["amazon", "flipkart", "reliance"];

      const formatted = sites
        .map((site) => {
          const data = res.data[site];
          if (!data) return null;

          return {
            site: site.charAt(0).toUpperCase() + site.slice(1),
            title: data.title,
            price: data.price,
            offers: data.offers,
            cashback: data.cashback,
            url: data.link,
            image: data.image,
            Unavailable: data.Unavailable || false,
          };
        })
        .filter(Boolean);

      setProducts(formatted);
    } catch (err) {
      console.error("Scrape error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------
  // Highlight matched text
  // --------------------------------------------------------
  const highlightText = (text, query) => {
    const regex = new RegExp(`(${query})`, "i");
    const parts = text.split(regex);

    return parts.map((p, idx) =>
      regex.test(p) ? (
        <span key={idx} className="font-semibold text-blue-600">
          {p}
        </span>
      ) : (
        <span key={idx}>{p}</span>
      )
    );
  };

  // --------------------------------------------------------
  // UI (with onBlur → pure react)
  // --------------------------------------------------------
  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      className="relative w-full max-w-2xl mx-auto"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setSuggestions([]); // close suggest box
        }
      }}
    >
      <label
        className="block text-lg mb-3"
        style={{
          color: "#00ffdd",
          fontFamily: "monospace",
          letterSpacing: "0.05em",
        }}
      >
        Search Product
      </label>

      <div className="relative">
        {/* INPUT */}
        <input
          type="text"
          className="w-full px-6 py-4 text-white text-lg outline-none bg-transparent"
          placeholder="Search for a mobile"
          value={query}
          onChange={(e) => {
            setBlockSuggest(false);
            setQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          style={{
            backgroundColor: "rgba(0, 100, 100, 0.3)",
            border: "2px solid #00ffdd",
            borderRadius: "8px",
            boxShadow:
              "0 0 20px rgba(0, 255, 221, 0.3), inset 0 0 20px rgba(0, 255, 221, 0.1)",
            fontFamily: "monospace",
          }}
        />

        {/* Search Button */}
        <button
          onClick={() => handleSearch(query)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform hover:cursor-pointer"
          style={{ color: "#00ffdd" }}
          disabled={!query || loading}
        >
          <Search size={24} />
        </button>
      </div>

      {/* SUGGESTIONS */}
      {(suggestions.length > 0 || suggestLoading) && (
        <ul
          className="absolute bg-slate-800 border w-full mt-2 rounded-lg shadow-xl max-h-60 overflow-y-auto z-10"
          style={{ borderColor: "#00ff9d" }}
        >
          {/* Loading spinner */}
          {suggestLoading && (
            <li className="px-4 py-3 text-gray-500 flex gap-3 items-center">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
              Searching…
            </li>
          )}

          {!suggestLoading &&
            suggestions.map((s, i) => (
              <li
                key={i}
                tabIndex={0} // required for focus-trap
                className={`px-4 py-2 cursor-pointer flex items-center gap-3 ${
                  i === activeIndex ? "bg-blue-100" : "hover:bg-blue-50"
                }`}
                onMouseDown={() => {
                  setBlockSuggest(true);
                  setQuery(s.name);
                  setSuggestions([]);
                  handleSearch(s.name);
                }}
                // on hover change activeIndex
                onMouseEnter={() => setActiveIndex(i)}

              >
                {s.img && (
                  <img src={s.img} alt={s.name} className="w-10 h-10 rounded" />
                )}

                <span
                  className={`${
                    i === activeIndex
                      ? "text-blue-600 font-semibold"
                      : "text-gray-300"
                  }`}
                >
                  {highlightText(s.name, query)}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;